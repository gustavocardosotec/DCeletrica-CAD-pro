/* CONTA REAL (cadastro com confirmação por e-mail, projetos salvos na conta, acesso do celular ou PC).
   Passo a passo no Supabase (supabase.com, plano grátis):
   1) New project. Depois: Settings > API e copie a "Project URL" e a chave "anon public" para as aspas abaixo.
   2) SQL Editor > cole e rode:
create table projetos(id uuid primary key default gen_random_uuid(), user_id uuid default auth.uid(), nome text, dados jsonb, atualizado timestamptz default now());
alter table projetos enable row level security;
create policy "dono" on projetos for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
   3) Authentication > Providers > Email: deixe "Confirm email" LIGADO (é o que exige verificar o e-mail).
   4) Authentication > URL Configuration: em "Site URL" coloque o endereço do seu site no Netlify (https://seusite.netlify.app).
      Sem isso o link do e-mail não volta para o seu site.
   A chave anon é pública por natureza; quem protege os dados de cada pessoa é a política (RLS) do passo 2. */
const SUPABASE_URL = "https://rqmhwkhhbhzvfqcrcdlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbWh3a2hoYmh6dmZxY3JjZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTk4OTMsImV4cCI6MjEwNzMzNTg5M30.cbRQsNmZtJDG8caS80JuMRDtp8dVDyKdteznxSGvOdQ";