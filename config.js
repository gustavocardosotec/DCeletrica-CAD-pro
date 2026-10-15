// Configuração do Supabase estruturada para o index.html
const CFG = {
  // Client ID do Google (Google Cloud > Credenciais > ID do cliente OAuth). Pode ficar público.
  googleId: '732718522302-gkshct7hfjeg17nngq68qnt6rlgfjuui.apps.googleusercontent.com',
  url: 'https://rqmhwkhhbhzvfqcrcdlz.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbWh3a2hoYmh6dmZxY3JjZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTk4OTMsImV4cCI6MjEwNzMzNTg5M30.cbRQsNmZtJDG8caS80JuMRDtp8dVDyKdteznxSGvOdQ'
};

let supabaseClient = null;

try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(CFG.url, CFG.key);
    console.log("Supabase conectado com sucesso!");
  } else {
    console.error("A biblioteca do Supabase ainda não carregou.");
  }
} catch (erro) {
  console.error("Erro ao inicializar o Supabase:", erro);
}