-- DARKSLAYERS - AVATAR MODERATION
-- Run once in Supabase SQL Editor.

alter table public.profiles
    add column if not exists avatar_pending_url text,
    add column if not exists avatar_status text not null default 'none';

-- Existing avatars are treated as approved so current profiles do not break.
update public.profiles
set avatar_status = 'approved'
where avatar_url is not null
  and avatar_status = 'none';

-- Normal users may update their own public profile, but database protection below
-- prevents them from directly publishing an unapproved avatar.
create or replace function public.protect_profile_avatar_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    actor_role text;
begin
    -- Service/admin SQL operations can pass through.
    if auth.uid() is null then
        return new;
    end if;

    select role into actor_role
    from public.profiles
    where id = auth.uid();

    -- Staff may approve/reject.
    if actor_role in ('admin','officer') then
        return new;
    end if;

    -- A normal member can NEVER change the public approved avatar directly.
    new.avatar_url := old.avatar_url;

    -- A normal member can only submit/replace a pending avatar for themselves.
    if auth.uid() <> old.id then
        raise exception 'You can only edit your own profile';
    end if;

    if new.avatar_pending_url is distinct from old.avatar_pending_url then
        new.avatar_status := 'pending';
    else
        -- They cannot self-approve by changing only the status.
        new.avatar_status := old.avatar_status;
    end if;

    return new;
end;
$$;

drop trigger if exists protect_profile_avatar_fields_trigger on public.profiles;
create trigger protect_profile_avatar_fields_trigger
before update on public.profiles
for each row
execute function public.protect_profile_avatar_fields();

-- Staff must be able to update profiles for avatar approval.
drop policy if exists "Staff can moderate public profiles" on public.profiles;
create policy "Staff can moderate public profiles"
on public.profiles
for update
to authenticated
using (
    exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('admin','officer')
    )
)
with check (
    exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.role in ('admin','officer')
    )
);

-- IMPORTANT:
-- avatar_url = only the approved/public avatar.
-- avatar_pending_url = upload waiting for staff review.
-- avatar_status = none / pending / approved / rejected.
