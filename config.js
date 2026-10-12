// Configuração e inicialização simples do Supabase
const SUPABASE_URL = "https://rqmhwkhhbhzvfqcrcdlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbWh3a2hoYmh6dmZxY3JjZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTk4OTMsImV4cCI6MjEwNzMzNTg5M30.cbRQsNmZtJDG8caS80JuMRDtp8dVDyKdteznxSGvOdQ";

// Cria o cliente global do Supabase para o seu projeto
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);