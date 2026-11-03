-- DARKSLAYERS - CONNECT ACCOUNTS TO GUILD ROSTER
-- Run this once in Supabase SQL Editor.

alter table public.members
    add column if not exists user_id uuid references auth.users(id) on delete set null;

create unique index if not exists members_user_id_unique
    on public.members(user_id)
    where user_id is not null;

-- Users never receive direct permission to choose a guild rank.
-- This function reads the logged-in user's MAIN character and syncs it to roster.
-- A new linked account always starts as MEMBER.
-- If staff later promotes that roster row, future syncs preserve that staff rank.
create or replace function public.sync_my_main_character_to_roster()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_char public.characters%rowtype;
begin
    if v_uid is null then
        raise exception 'Not authenticated';
    end if;

    select *
      into v_char
      from public.characters
     where user_id = v_uid
       and is_main = true
     order by created_at desc
     limit 1;

    if not found then
        delete from public.members
         where user_id = v_uid;
        return;
    end if;

    insert into public.members (
        name,
        game,
        class,
        role,
        rank,
        level,
        user_id
    )
    values (
        v_char.character_name,
        v_char.game,
        v_char.class,
        v_char.combat_role,
        'member',
        v_char.level,
        v_uid
    )
    on conflict (user_id) where user_id is not null
    do update set
        name  = excluded.name,
        game  = excluded.game,
        class = excluded.class,
        role  = excluded.role,
        level = excluded.level;
        -- IMPORTANT: rank is intentionally NOT updated here.
        -- Only staff controls promotions.
end;
$$;

revoke all on function public.sync_my_main_character_to_roster() from public;
grant execute on function public.sync_my_main_character_to_roster() to authenticated;

-- Optional one-time cleanup:
-- Existing manual roster entries remain untouched.
-- Linked account rows are created only when a user saves/sets a MAIN character.
