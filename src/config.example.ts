// EXEMPLO DE CONFIGURAÇÃO - COPIE ESTE ARQUIVO PARA config.ts E CONFIGURE COM SUAS CREDENCIAIS

// Configurações do Supabase
export const SUPABASE_CONFIG = {
  // IMPORTANTE: Substitua estas URLs e chaves pelas suas do Supabase
  // Você pode encontrar essas informações no painel do Supabase em Settings > API
  SUPABASE_URL: 'https://abcdefghijklmnop.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0NzI5MCwiZXhwIjoxOTUyMTIzMjkwfQ.EXAMPLE_KEY_HERE',
  
  // Configurações do Storage
  STORAGE_BUCKET: 'avatars',
  
  // Configurações da tabela de perfis
  PROFILES_TABLE: 'profiles',
};

// Configurações da aplicação
export const APP_CONFIG = {
  APP_NAME: 'POC Integração Supabase',
  VERSION: '1.0.0',
  
  // Validações
  MIN_PASSWORD_LENGTH: 6,
  
  // Mensagens
  MESSAGES: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    REGISTER_SUCCESS: 'Conta criada com sucesso! Verifique seu email e faça login.',
    PROFILE_UPDATE_SUCCESS: 'Perfil atualizado com sucesso!',
    PHOTO_UPDATE_SUCCESS: 'Foto atualizada com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    
    ERRORS: {
      FILL_ALL_FIELDS: 'Por favor, preencha todos os campos',
      PASSWORDS_DONT_MATCH: 'As senhas não coincidem',
      PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 6 caracteres',
      INVALID_EMAIL: 'Por favor, informe um email válido',
      LOGIN_ERROR: 'Erro no login. Verifique suas credenciais.',
      REGISTER_ERROR: 'Erro no cadastro. Tente novamente.',
      PROFILE_UPDATE_ERROR: 'Não foi possível salvar o perfil',
      PHOTO_UPLOAD_ERROR: 'Não foi possível fazer upload da foto',
      PERMISSION_DENIED: 'Permissão negada para acessar a galeria',
    }
  }
};

/*
INSTRUÇÕES PARA CONFIGURAÇÃO:

1. Acesse https://supabase.com e crie uma conta
2. Crie um novo projeto
3. Vá para Settings > API no painel do projeto
4. Copie a "Project URL" e cole em SUPABASE_URL
5. Copie a "anon public" key e cole em SUPABASE_ANON_KEY
6. Renomeie este arquivo para config.ts
7. Execute os scripts SQL fornecidos no README.md para configurar o banco

EXEMPLO DE VALORES:
SUPABASE_URL: 'https://abcdefghijklmnop.supabase.co'
SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
*/
