// ==========================================
// CONFIGURAÇÃO E INICIALIZAÇÃO DO SUPABASE
// ==========================================
const SUPABASE_URL = "https://rqmhwkhhbzvfqcrcdlz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbWh3a2hoYmh6dmZxY3JjZGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTk4OTMsImV4cCI6MjEwNzMzNTg5M30.cbRQsNmZtJDG8caS80JuMRDtp8dVDyKdteznxSGvOdQ";

// Inicializa o cliente do Supabase de forma segura
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase conectado com sucesso!");
} else {
  console.error("A biblioteca do Supabase (supabase-js) não foi carregada no HTML!");
}

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO (CADASTRO E LOGIN)
// ==========================================

// Função para Cadastrar Novo Usuário
async function cadastrarUsuario(email, senha) {
  if (!supabaseClient) {
    alert("Erro: Supabase não inicializado.");
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: senha,
    });

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
      console.error(error);
      return;
    }

    alert("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta antes de entrar.");
    return data;
  } catch (err) {
    console.error("Erro inesperado no cadastro:", err);
  }
}

// Função para Fazer Login
async function fazerLogin(email, senha) {
  if (!supabaseClient) {
    alert("Erro: Supabase não inicializado.");
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
      console.error(error);
      return;
    }

    alert("Login realizado com sucesso!");
    // Redireciona ou atualiza a tela para a área logada
    window.location.href = "index.html"; 
    return data;
  } catch (err) {
    console.error("Erro inesperado no login:", err);
  }
}

// Função para Sair (Logout)
async function fazerLogout() {
  if (!supabaseClient) return;
  
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("Erro ao sair:", error.message);
  } else {
    window.location.reload();
  }
}

// ==========================================
// EVENTOS DOS BOTÕES DA TELA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Ajuste os IDs abaixo conforme o HTML do seu projeto (ex: ids dos inputs de email e senha, e dos botões)
  const btnCadastrar = document.getElementById("btn-cadastrar"); // Troque pelo ID do seu botão de cadastro
  const btnLogin = document.getElementById("btn-login");         // Troque pelo ID do seu botão de login

  if (btnCadastrar) {
    btnCadastrar.addEventListener("click", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email").value;
      const senhaInput = document.getElementById("senha").value;
      cadastrarUsuario(emailInput, senhaInput);
    });
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email").value;
      const senhaInput = document.getElementById("senha").value;
      fazerLogin(emailInput, senhaInput);
    });
  }
});