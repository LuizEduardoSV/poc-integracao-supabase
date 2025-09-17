// Configurações do Supabase
export const SUPABASE_CONFIG = {
  // IMPORTANTE: Substitua estas URLs e chaves pelas suas do Supabase
  // Você pode encontrar essas informações no painel do Supabase em Settings > API
  SUPABASE_URL: 'https://alrrayvjveirssynnvfv.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscnJheXZqdmVpcnNzeW5udmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTgwMzcsImV4cCI6MjA3MjQ5NDAzN30.A3WiUFX69aWvrlfnZqlMktiHQPSv0PZ4DLrLyxKaDaY',
  
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
