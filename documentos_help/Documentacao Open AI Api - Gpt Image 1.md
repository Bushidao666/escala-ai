# Documentação da API OpenAI - Modelo gpt-image-1

## Visão Geral

O modelo `gpt-image-1` é o mais avançado modelo de geração de imagens da OpenAI, oferecendo recursos aprimorados de qualidade, controle e flexibilidade em comparação com os modelos DALL-E anteriores.

## Endpoints Suportados

O modelo `gpt-image-1` suporta os seguintes endpoints:

✅ **Create Image** (`/v1/images/generations`)  
✅ **Create Image Edit** (`/v1/images/edits`)  

---

## 1. Create Image (Geração de Imagens)

**Endpoint:** `POST https://api.openai.com/v1/images/generations`

### Parâmetros Específicos do gpt-image-1

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `model` | string | Opcional | Deve ser `"gpt-image-1"` para usar este modelo |
| `prompt` | string | **Obrigatório** | Descrição da imagem desejada (máximo: **32.000 caracteres**) |
| `background` | string | Opcional | Controla a transparência do fundo: `"transparent"`, `"opaque"`, `"auto"` (padrão) |
| `moderation` | string | Opcional | Nível de moderação de conteúdo: `"low"`, `"auto"` (padrão) |
| `output_compression` | integer | Opcional | Nível de compressão 0-100% (padrão: 100) - apenas para formatos `webp` e `jpeg` |
| `output_format` | string | Opcional | Formato de saída: `"png"` (padrão), `"jpeg"`, `"webp"` |
| `quality` | string | Opcional | Qualidade da imagem: `"auto"` (padrão), `"high"`, `"medium"`, `"low"` |
| `size` | string | Opcional | Tamanho: `"auto"` (padrão), `"1024x1024"`, `"1536x1024"`, `"1024x1536"` |
| `n` | integer | Opcional | Número de imagens (1-10, padrão: 1) |

### Características Especiais

- **Formato de Resposta:** Sempre retorna imagens em formato base64 (não suporta URLs)
- **Background Transparente:** Suporte nativo para fundos transparentes
- **Múltiplos Formatos:** Suporte para PNG, JPEG e WebP
- **Prompts Longos:** Suporte para prompts de até 32.000 caracteres
- **Controle de Qualidade:** 4 níveis de qualidade (auto, high, medium, low)

### Exemplo de Requisição

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-image-1",
    "prompt": "Um robô futurista em um laboratório high-tech, estilo cyberpunk, com luzes neon azuis e verdes, renderização 3D ultra-realista",
    "size": "1024x1536",
    "quality": "high",
    "background": "transparent",
    "output_format": "webp",
    "output_compression": 85,
    "moderation": "auto"
  }'
```

---

## 2. Create Image Edit (Edição de Imagens)

**Endpoint:** `POST https://api.openai.com/v1/images/edits`

### Parâmetros Específicos do gpt-image-1

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `model` | string | Opcional | Deve ser `"gpt-image-1"` para usar este modelo |
| `image` | string/array | **Obrigatório** | Até **16 imagens** (PNG/WebP/JPG < 50MB cada) |
| `prompt` | string | **Obrigatório** | Descrição da edição desejada (máximo: **32.000 caracteres**) |
| `background` | string | Opcional | Controla a transparência: `"transparent"`, `"opaque"`, `"auto"` (padrão) |
| `mask` | file | Opcional | Máscara PNG para áreas de edição |
| `output_compression` | integer | Opcional | Nível de compressão 0-100% (padrão: 100) |
| `output_format` | string | Opcional | Formato: `"png"` (padrão), `"jpeg"`, `"webp"` |
| `quality` | string | Opcional | Qualidade: `"auto"` (padrão), `"high"`, `"medium"`, `"low"` |
| `size` | string | Opcional | Tamanho: `"auto"` (padrão), `"1024x1024"`, `"1536x1024"`, `"1024x1536"` |
| `n` | integer | Opcional | Número de imagens (1-10, padrão: 1) |

### Recursos Avançados

- **Múltiplas Imagens:** Pode processar até 16 imagens simultaneamente
- **Arquivos Grandes:** Suporte para imagens de até 50MB cada
- **Formatos Flexíveis:** PNG, WebP e JPEG como entrada
- **Edição Inteligente:** Combina múltiplas imagens em uma composição

### Exemplo de Requisição (Múltiplas Imagens)

```bash
curl -X POST "https://api.openai.com/v1/images/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-1" \
  -F "image[]=@produto1.png" \
  -F "image[]=@produto2.png" \
  -F "image[]=@produto3.png" \
  -F "image[]=@produto4.png" \
  -F 'prompt=Criar uma vitrine elegante com estes quatro produtos, iluminação profissional, fundo branco limpo' \
  -F "quality=high" \
  -F "output_format=webp" \
  -F "background=opaque"
```

---

## 3. Estrutura de Resposta

### Resposta Padrão

```json
{
  "created": 1713833628,
  "data": [
    {
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAAA..."
    }
  ],
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
```

### Campos da Resposta

| Campo | Descrição |
|-------|-----------|
| `created` | Timestamp Unix da criação |
| `data[].b64_json` | Imagem codificada em base64 |
| `usage.total_tokens` | Total de tokens utilizados |
| `usage.input_tokens` | Tokens de entrada (texto + imagem) |
| `usage.output_tokens` | Tokens de saída (imagem gerada) |

---

## 4. Limites e Restrições

### Limites Técnicos

- **Prompt máximo:** 32.000 caracteres
- **Imagens de entrada:** Até 16 imagens por requisição
- **Tamanho por imagem:** Máximo 50MB
- **Formatos suportados:** PNG, WebP, JPEG
- **Número de imagens geradas:** 1-10 por requisição

### Formatos de Saída

- **PNG:** Suporte completo a transparência
- **WebP:** Melhor compressão, suporte a transparência
- **JPEG:** Menor tamanho, sem transparência

### Qualidade vs. Performance

| Qualidade | Tempo de Processamento | Qualidade Visual | Uso Recomendado |
|-----------|----------------------|------------------|------------------|
| `low` | Rápido | Básica | Protótipos, testes |
| `medium` | Moderado | Boa | Uso geral |
| `high` | Lento | Excelente | Produção, materiais finais |
| `auto` | Variável | Otimizada | Padrão recomendado |

---

## 5. Boas Práticas

### Otimização de Prompts

- Use descrições detalhadas para melhores resultados
- Especifique estilo, iluminação e composição
- Inclua detalhes técnicos (resolução, tipo de renderização)
- Para edições, seja específico sobre as mudanças desejadas

### Configurações Recomendadas

**Para Produção:**
```json
{
  "quality": "high",
  "output_format": "webp",
  "output_compression": 90,
  "background": "auto"
}
```

**Para Desenvolvimento:**
```json
{
  "quality": "medium",
  "output_format": "png",
  "background": "transparent"
}
```

### Controle de Custos

- Use `quality: "medium"` para desenvolvimento
- Configure `output_compression` para reduzir tamanho
- Limite `n` para o número necessário de variações

---

## 6. Casos de Uso Principais

### Criação de Conteúdo
- Ilustrações para blogs e artigos
- Imagens para redes sociais
- Materiais de marketing

### Design e Prototipagem
- Conceitos visuais
- Mockups de interfaces
- Visualização de produtos

### Edição Avançada
- Composições complexas
- Remoção/adição de elementos
- Combinação de múltiplas imagens

### E-commerce
- Imagens de produtos
- Catálogos visuais
- Cenários de uso

---

## 7. Troubleshooting

### Problemas Comuns

**Imagem muito escura/clara:**
- Ajuste `quality` para `"high"`
- Especifique iluminação no prompt

**Fundo indesejado:**
- Use `background: "transparent"`
- Configure `output_format: "png"`

**Arquivo muito grande:**
- Reduza `output_compression`
- Use formato `"webp"` ou `"jpeg"`

**Qualidade insuficiente:**
- Aumente `quality` para `"high"`
- Use prompts mais detalhados
- Aumente resolução (`size`)

### Códigos de Erro Específicos

- **400:** Prompt muito longo (> 32.000 caracteres)
- **413:** Imagem muito grande (> 50MB)
- **422:** Formato de imagem não suportado
- **429:** Limite de requisições excedido