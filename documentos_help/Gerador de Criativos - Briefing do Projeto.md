# Briefing: Gerador de Criativos com IA

## 📋 Visão Geral do Projeto

**Nome do Projeto:** Gerador de Criativos conectado à API do ChatGPT

**Objetivo:** Desenvolver uma ferramenta interna para automatizar a criação de materiais criativos para marketing digital, utilizando inteligência artificial para gerar conteúdo personalizado baseado nas especificações da equipe.

**Uso:** Ferramenta interna da empresa/equipe para agilizar a produção de criativos sem necessidade de gerenciamento de múltiplos usuários.

## 🎯 Funcionalidades Principais

### Core Features:
- **Geração de criativos** via API do ChatGPT
- **Upload de imagens** (logo e produtos/referências)
- **Customização visual** (cores, estilos, textos)
- **Múltiplos formatos** de saída
- **Gerenciamento de solicitações** em fila
- **Galeria de criativos** gerados
- **Sistema de download** individual e em lote

## 🖥️ Detalhamento das Telas

### TELA 1: Interface Principal de Criação
**Função:** Formulário principal para solicitação de criativos

#### Componentes de Input:
1. **Descrição do Criativo**
   - Campo de texto longo (textarea)
   - Placeholder: "Descreva o criativo que você deseja gerar..."
   - Máximo de caracteres: 500

2. **Upload de Imagens**
   - **Logo:** Upload de arquivo (PNG, JPG, SVG)
   - **Produto/Referência:** Upload múltiplo de arquivos
   - Pré-visualização das imagens carregadas
   - Opção de remover imagens

3. **Seleção de Estilo**
   - Dropdown ou cards com opções:
     - Minimalista
     - Moderno
     - Corporativo
     - Criativo/Artístico
     - Elegante
     - Divertido
     - Tecnológico

4. **Paleta de Cores**
   - **Cor Primária:** Seletor de cor com campo HEX
   - **Cor Secundária:** Seletor de cor com campo HEX
   - Pré-visualização da paleta

5. **Textos do Criativo**
   - **Headline:** Campo de texto (máx. 60 caracteres)
   - **Sub-headline:** Campo de texto (máx. 120 caracteres)
   - **CTA (Call to Action):** Campo de texto (máx. 25 caracteres)

6. **Formato do Criativo**
   - Seleção por radio buttons ou cards:
     - **9:16** - Stories Instagram/TikTok
     - **1:1** - Feed Instagram/Facebook
     - **16:9** - Google Ads/YouTube
     - **3:4** - Google Ads Vertical
     - **9:16** - Instagram Reels

#### Ações:
- **Botão "Gerar Criativo"** - Envia solicitação para processamento
- **Botão "Limpar Formulário"** - Reset dos campos
- **Botão "Salvar Rascunho"** - Salva configurações localmente

### TELA 2: Fila de Processamento
**Função:** Monitoramento do status das solicitações

#### Componentes:
1. **Lista de Solicitações**
   - Card para cada solicitação contendo:
     - ID da solicitação
     - Timestamp de criação
     - Status atual (Pendente, Processando, Concluído, Erro)
     - Barra de progresso
     - Miniatura do resultado (quando concluído)

2. **Status Possíveis:**
   - 🟡 **Pendente:** Na fila aguardando processamento
   - 🔵 **Processando:** Sendo gerado pela IA
   - 🟢 **Concluído:** Criativo gerado com sucesso
   - 🔴 **Erro:** Falha no processamento

3. **Funcionalidades:**
   - Refresh automático da lista
   - Filtros por status
   - Ordenação por data
   - Botão para cancelar solicitações pendentes

### TELA 3: Galeria de Criativos
**Função:** Visualização e gerenciamento dos criativos gerados

#### Layout:
- **Grade de criativos** com miniaturas
- **Filtros laterais:**
  - Por formato
  - Por data de criação
  - Por estilo
  - Por status

#### Funcionalidades:
1. **Visualização:**
   - Modal para visualização em tamanho real
   - Zoom e pan da imagem
   - Informações do criativo (dimensões, formato, data)

2. **Downloads:**
   - **Botão "Baixar Tudo"** - Gera ZIP com todos os criativos
   - **Download individual** - Por criativo específico
   - Opções de qualidade (HD, Impressão, Web)

3. **Gerenciamento:**
   - Favoritar criativos
   - Excluir criativos
   - Compartilhar via link
   - Duplicar configurações para nova criação

### TELA 4: Configurações
**Função:** Configuração da ferramenta e credenciais de API

#### Seções de Configuração:

1. **API OpenAI**
   - **Campo para API Key:** Input password com botão "mostrar/ocultar"
   - **Teste de Conexão:** Botão para verificar se a API Key é válida
   - **Status da Conexão:** Indicador visual (conectado/desconectado)
   - **Modelo selecionado:** Dropdown para escolher modelo GPT (GPT-4, GPT-3.5-turbo)

2. **Configurações de Geração**
   - **Qualidade padrão:** Slider para definir qualidade das imagens geradas
   - **Timeout:** Campo para definir tempo limite de processamento
   - **Tentativas:** Número de tentativas em caso de erro

3. **Configurações de Interface**
   - **Tema:** Toggle Dark/Light mode
   - **Idioma:** Dropdown para seleção de idioma
   - **Auto-refresh:** Configurar frequência de atualização da fila

4. **Configurações de Storage**
   - **Bucket padrão:** Configurar bucket do Supabase Storage
   - **Retenção de arquivos:** Configurar por quantos dias manter os criativos
   - **Limpeza automática:** Policies de limpeza automática no Supabase
   - **Limite de storage:** Monitorar uso do Supabase Storage

#### Funcionalidades:
- **Botão "Salvar Configurações"** - Persiste no banco Supabase
- **Botão "Restaurar Padrões"** - Reset para configurações iniciais
- **Botão "Testar Conexão"** - Valida OpenAI API e Supabase
- **Indicador de Quota** - Mostra uso atual do Supabase

## 🔧 Especificações Técnicas

### Frontend:
- **Framework:** React/Next.js ou Vue.js
- **Styling:** Tailwind CSS ou Material-UI
- **Upload:** React Dropzone ou similar
- **State Management:** Redux/Zustand ou Context API
- **Rotas:** React Router ou Next.js Router

### Backend:
- **API:** Node.js com Express ou Python FastAPI
- **Banco de Dados:** PostgreSQL ou MongoDB
- **File Storage:** AWS S3 ou Google Cloud Storage
- **Queue System:** Redis com Bull/Bee-Queue

### Integrações:
- **OpenAI API:** Para geração de conteúdo
- **Image Processing:** Sharp ou Pillow
- **PDF Generation:** jsPDF ou similar

## 🔄 Fluxo da Ferramenta

1. **Configuração Inicial:**
   - Na primeira utilização, configurar OpenAI API Key na Tela 4
   - Dados salvos no banco Supabase de forma segura
   - Configurar buckets de storage no Supabase
   - Definir configurações padrão persistidas

2. **Criação:**
   - Preencher formulário na Tela 1
   - Upload de imagens para Supabase Storage
   - Sistema valida dados e cria registro no banco
   - Trigger de banco inicia processamento

3. **Processamento:**
   - Supabase Function processa via OpenAI API
   - Status atualizado em real-time no banco
   - Criativo salvo no Supabase Storage
   - Notificações via Supabase Real-time

4. **Resultado:**
   - Criativo aparece automaticamente na Tela 2
   - Visualização na Tela 3 com dados do banco
   - Download direto do Supabase Storage

## 📱 Responsividade

- **Desktop:** Layout completo com todas as funcionalidades
- **Tablet:** Adaptação dos formulários e galerias
- **Mobile:** Interface otimizada para telas menores

## 🎨 Considerações de UI/UX

### Design System:
- Paleta de cores consistente
- Tipografia hierárquica
- Componentes reutilizáveis
- Estados de loading e erro
- Feedback visual para ações

### Acessibilidade:
- Labels descritivos
- Contraste adequado
- Navegação por teclado
- Screen reader friendly

## 🔐 Segurança e Performance

### Segurança:
- Validação de uploads via Supabase Storage Policies
- Sanitização de inputs no frontend e Supabase Functions
- Row Level Security (RLS) no Supabase
- OpenAI API Key segura em Supabase Secrets
- Autenticação opcional via Supabase Auth (para futuro)

### Performance:
- Lazy loading de imagens do Supabase Storage
- Cache automático via Supabase Edge Caching
- Real-time updates sem polling
- Compressão automática de imagens no Supabase
- CDN global do Supabase

## 📊 Métricas e Monitoramento

- Número de criativos gerados por dia/semana
- Tempo médio de processamento
- Formatos mais utilizados
- Taxa de erro das solicitações
- Uso da API OpenAI (tokens consumidos)
- Performance da ferramenta interna