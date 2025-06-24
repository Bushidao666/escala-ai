# Configuração de Ambiente - Creative Generator

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Next.js + Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Como Obter as Chaves

### 1. Supabase
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings > API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 2. OpenAI API
⚠️ **Agora é configurado na interface!**
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Clique em **Create new secret key**
3. **Configure na página `/settings`** da aplicação
4. Cada usuário pode ter sua própria chave

## Exemplo de `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rlvuelmtmojzxwtamheq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Configuração Passo a Passo

### 1. Configure o Ambiente
- Crie o `.env.local` com as 3 variáveis do Supabase
- Reinicie o servidor: `npm run dev`

### 2. Configure a OpenAI API
- Faça login na aplicação
- Vá em **Configurações** (`/settings`)
- Adicione sua chave OpenAI na seção **"API da OpenAI"**
- Ajuste outras preferências (qualidade, formato, etc.)

### 3. Teste o Sistema
- Crie um criativo na página `/new`
- Vá para `/queue` e clique em **"Processar Fila"**
- Acompanhe o progresso em tempo real

## Vantagens do Sistema Dinâmico

✅ **Multi-usuário**: Cada usuário pode usar sua própria chave OpenAI
✅ **Flexível**: Não precisa reiniciar servidor para trocar chaves
✅ **Seguro**: Chaves ficam criptografadas no banco
✅ **Prático**: Configure tudo pela interface 