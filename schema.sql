create extension if not exists "pgcrypto";

create table if not exists public.scam_logs (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  input_content text,
  threat_level  text not null check (threat_level in ('Red','Yellow','Green','Invalid')),
  reasoning     text
);

create index if not exists scam_logs_created_at_idx
  on public.scam_logs (created_at desc);

alter table public.scam_logs enable row level security;

drop policy if exists "anon_insert_scam_logs" on public.scam_logs;
drop policy if exists "anon_select_scam_logs" on public.scam_logs;

create policy "anon_insert_scam_logs"
  on public.scam_logs for insert
  to anon
  with check (true);

create policy "anon_select_scam_logs"
  on public.scam_logs for select
  to anon
  using (true);

-- No UPDATE / DELETE policies exist, so RLS blocks them. Revoke grants as well.
revoke update, delete on public.scam_logs from anon, authenticated;
grant select, insert on public.scam_logs to anon;

-- Demo seed data
insert into public.scam_logs (input_content, threat_level, reasoning, created_at) values
(
  'Congratulations! Aapne KBC Lottery me Rs 25,00,000 jeete hain. Claim karne ke liye abhi WhatsApp karein +92 3XX XXXXXXX aur Rs 5,000 processing fee bhejein. Amitabh Bachchan Official.',
  'Red',
  'Ye KBC lottery ka fake message hai — asli KBC kabhi paise maangkar inaam nahi deta, is number ko turant block karein.',
  now() - interval '5 minutes'
),
(
  'Dear Customer, aapka bijli connection aaj raat 9:30 baje kat jayega kyunki pichhle bill ka payment pending hai. Turant 98XXXXXX21 par call karein ya link par update karein: bit.ly/electricity-bill-upd',
  'Red',
  'Bijli vibhag aise SMS me personal number ya shortened link nahi bhejta — ye phishing hai, apne official bill app se hi check karein.',
  now() - interval '35 minutes'
),
(
  'Your SBI account will be blocked today. KYC update karne ke liye link par click karein aur apna PAN, Aadhaar aur OTP enter karein: sbi-kyc-update.in/login',
  'Red',
  'Bank kabhi SMS link par OTP ya Aadhaar nahi maangta — ye fake KYC site hai, link kholne se paise ud sakte hain.',
  now() - interval '2 hours'
),
(
  'Work from home job! Daily Rs 3,000 kamayein sirf YouTube videos like karke. Telegram par join karein: t.me/easyearn_india. Pehle Rs 500 registration fee.',
  'Yellow',
  'Registration fee maangne wali "like karke kamao" jobs aksar fraud hoti hain — paise bhejne se pehle company ki poori jaanch karein.',
  now() - interval '1 day'
),
(
  'HDFC Bank: Rs 1,200.00 debited from A/c XX4821 on 12-Jul at Big Bazaar. Agar aapne ye transaction nahi kiya to bank ki official app ya 1800 202 6161 par sampark karein.',
  'Green',
  'Ye ek normal bank transaction alert lagta hai jisme koi link ya OTP nahi maanga gaya — fir bhi shak ho to official app se verify karein.',
  now() - interval '2 days'
);
