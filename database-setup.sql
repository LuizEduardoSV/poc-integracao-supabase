-- =====================================================
-- CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE
-- POC Integração Supabase
-- =====================================================

-- 1. CRIAR TABELA DE PERFIS
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nome TEXT,
  descricao TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Política para usuários verem apenas seus próprios perfis
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários editarem apenas seus próprios perfis
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para usuários inserirem seus próprios perfis
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. CRIAR FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. CRIAR TRIGGER PARA ATUALIZAR TIMESTAMP AUTOMATICAMENTE
-- =====================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 6. CONFIGURAR STORAGE BUCKET
-- =====================================================
-- NOTA: O bucket 'avatars' deve ser criado manualmente no painel do Supabase
-- Vá para Storage > New Bucket e crie um bucket chamado 'avatars'

-- 7. CONFIGURAR POLÍTICAS DE STORAGE
-- =====================================================

-- Política para usuários fazerem upload de suas próprias imagens
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para usuários visualizarem suas próprias imagens
CREATE POLICY "Users can view own avatar" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para usuários deletarem suas próprias imagens
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 8. CRIAR FUNÇÃO PARA INSERIR PERFIL AUTOMATICAMENTE APÓS CADASTRO
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, created_at)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'nome', 'Usuário'), NOW());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CRIAR TRIGGER PARA INSERIR PERFIL AUTOMATICAMENTE
-- =====================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. VERIFICAR CONFIGURAÇÃO
-- =====================================================
-- Execute estas consultas para verificar se tudo foi configurado corretamente

-- Verificar se a tabela foi criada
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'profiles';

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verificar se o trigger foi criado
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'update_profiles_updated_at';

-- =====================================================
-- INSTRUÇÕES ADICIONAIS
-- =====================================================

/*
PASSO A PASSO PARA CONFIGURAÇÃO COMPLETA:

1. Execute este script SQL no SQL Editor do Supabase
2. Vá para Storage > New Bucket e crie um bucket chamado 'avatars'
3. Configure as permissões do bucket como público (para este POC)
4. No seu projeto React Native, atualize src/config.ts com suas credenciais
5. Teste o aplicativo

NOTAS IMPORTANTES:
- Este script cria um sistema de segurança robusto
- Usuários só podem acessar seus próprios dados
- Perfis são criados automaticamente após cadastro
- Timestamps são atualizados automaticamente
- Storage é protegido com políticas de acesso individual

PARA TESTAR:
1. Cadastre um novo usuário
2. Faça login
3. Edite o perfil
4. Faça upload de uma foto
5. Verifique se os dados estão sendo salvos corretamente
*/
