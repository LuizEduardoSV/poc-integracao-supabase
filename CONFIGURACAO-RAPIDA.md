# 🚀 CONFIGURAÇÃO RÁPIDA - POC Integração Supabase

## ⚡ Passos Essenciais (5 minutos)

### 1. Configure o Supabase
- Acesse [supabase.com](https://supabase.com) e crie uma conta
- Crie um novo projeto
- Vá para **Settings > API** e copie:
  - **Project URL**
  - **anon public key**

### 2. Configure o Projeto
- Renomeie `src/config.example.ts` para `src/config.ts`
- Substitua as credenciais em `src/config.ts`:
  ```typescript
  SUPABASE_URL: 'https://SEU-PROJETO.supabase.co'
  SUPABASE_ANON_KEY: 'SUA-ANON-KEY'
  ```

### 3. Configure o Banco de Dados
- No painel do Supabase, vá para **SQL Editor**
- Execute o script `database-setup.sql` completo
- Vá para **Storage** e crie um bucket chamado `avatars`

### 4. Execute o Projeto
```bash
npm start
```

## 🔧 Estrutura do Projeto

```
src/
├── screens/
│   ├── LoginScreen.tsx      # ✅ Login com email/senha
│   ├── RegisterScreen.tsx   # ✅ Cadastro com validação
│   └── ProfileScreen.tsx    # ✅ Edição de perfil + foto
├── config.ts                # ⚙️ Configurações do Supabase
├── supabase.ts              # 🔌 Cliente do Supabase
└── AppNavigator.tsx         # 🧭 Navegação protegida
```

## ✅ Funcionalidades Implementadas

- **Autenticação completa** com Supabase Auth
- **Tela de login** com validações
- **Tela de cadastro** com confirmação de senha
- **Tela de perfil** com campos Nome, Descrição e Foto
- **Upload de imagens** para Supabase Storage
- **Proteção de rotas** - perfil só acessível logado
- **Interface moderna** com React Native
- **Validações** de formulários
- **Tratamento de erros** robusto

## 🗄️ Banco de Dados

- Tabela `profiles` com RLS habilitado
- Storage bucket `avatars` para fotos
- Políticas de segurança configuradas
- Triggers automáticos para timestamps

## 🚨 Problemas Comuns

### Erro de conexão
- Verifique se as credenciais estão corretas em `src/config.ts`
- Confirme se o projeto Supabase está ativo

### Erro de upload
- Verifique se o bucket `avatars` foi criado
- Execute o script SQL completo

### Erro de autenticação
- Verifique se o email foi confirmado (novos usuários)
- Senha deve ter pelo menos 6 caracteres

## 📱 Teste Rápido

1. **Cadastre** um novo usuário
2. **Faça login** com as credenciais
3. **Edite o perfil** (nome, descrição)
4. **Faça upload** de uma foto
5. **Salve** e verifique se funcionou

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

---

**🎯 Projeto configurado e funcionando em 5 minutos!**
