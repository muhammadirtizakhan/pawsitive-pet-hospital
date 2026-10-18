-- Run once in Supabase SQL Editor. No existing order table is modified.
begin;
create table if not exists public.chatbot_limits (
  key text primary key, hits integer not null, expires_at timestamptz not null
);
create table if not exists public.chatbot_order_sessions (
  session_hash text primary key,
  order_id uuid references public.orders(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  verified_until timestamptz
);
alter table public.chatbot_limits enable row level security;
alter table public.chatbot_order_sessions enable row level security;
revoke all on public.chatbot_limits, public.chatbot_order_sessions from anon, authenticated;
grant all on public.chatbot_limits, public.chatbot_order_sessions to service_role;

create or replace function public.chatbot_take_limit(p_key text, p_max integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  insert into chatbot_limits(key,hits,expires_at)
  values(p_key,1,now()+make_interval(secs=>p_seconds))
  on conflict(key) do update set
    hits=case when chatbot_limits.expires_at<=now() then 1 else chatbot_limits.hits+1 end,
    expires_at=case when chatbot_limits.expires_at<=now() then excluded.expires_at else chatbot_limits.expires_at end
  returning hits into n;
  return n<=p_max;
end;
$$;

create or replace function public.chatbot_verify_code(p_session text, p_hash text)
returns boolean language plpgsql security definer set search_path = public as $$
declare s chatbot_order_sessions%rowtype;
begin
  select * into s from chatbot_order_sessions where session_hash=p_session for update;
  if not found or s.expires_at<=now() or s.attempts>=5 or s.verified_until is not null then
    return false;
  end if;
  update chatbot_order_sessions set attempts=attempts+1 where session_hash=p_session;
  if s.order_id is null or s.code_hash<>p_hash then return false; end if;
  update chatbot_order_sessions set verified_until=now()+interval '20 minutes', code_hash='used'
  where session_hash=p_session;
  return true;
end;
$$;
revoke all on function public.chatbot_take_limit(text,integer,integer) from public,anon,authenticated;
revoke all on function public.chatbot_verify_code(text,text) from public,anon,authenticated;
grant execute on function public.chatbot_take_limit(text,integer,integer) to service_role;
grant execute on function public.chatbot_verify_code(text,text) to service_role;
commit;
-- Optional periodic cleanup (expired rows grant no access even before cleanup):
-- delete from public.chatbot_limits where expires_at < now()-interval '1 day';
-- delete from public.chatbot_order_sessions
-- where greatest(expires_at,coalesce(verified_until,expires_at)) < now()-interval '1 day';
