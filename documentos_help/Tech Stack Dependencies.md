# 🛠️ Stack Tecnológica: Gerador de Criativos

## 🎨 **Frontend Framework**

### Core Framework
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

## 🗄️ **Backend & Database**

### Supabase
```json
{
  "@supabase/supabase-js": "^2.38.0",
  "@supabase/auth-helpers-nextjs": "^0.8.0",
  "@supabase/auth-helpers-react": "^0.4.0",
  "@supabase/realtime-js": "^2.8.0"
}
```

## 🎭 **UI & Design System**

### Shadcn/UI
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add label
```

### Styling & Animations
```json
{
  "tailwindcss": "^3.4.0",
  "framer-motion": "^10.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "tailwindcss-animate": "^1.0.0"
}
```

## 🖼️ **File Handling**

### Upload & Images
```json
{
  "react-dropzone": "^14.2.0",
  "react-colorful": "^5.6.0",
  "file-saver": "^2.0.0"
}
```

## 🤖 **AI Integration**

### OpenAI
```json
{
  "openai": "^4.0.0"
}
```

## 🔄 **State & Data**

### State Management
```json
{
  "zustand": "^4.4.0",
  "swr": "^2.2.0"
}
```

### Forms
```json
{
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "zod": "^3.22.0"
}
```

## 📱 **Icons & Utils**

### Icons
```json
{
  "lucide-react": "^0.300.0"
}
```

### Utilities
```json
{
  "axios": "^1.6.0",
  "uuid": "^9.0.0",
  "date-fns": "^2.30.0",
  "lodash": "^4.17.0"
}
```

## 🔧 **Development Tools**

### Build Tools
```json
{
  "eslint": "^8.0.0",
  "eslint-config-next": "^14.0.0",
  "prettier": "^3.1.0",
  "autoprefixer": "^10.0.0",
  "postcss": "^8.0.0"
}
```

### Types
```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "@types/uuid": "^9.0.0",
  "@types/lodash": "^4.14.0"
}
```

## 📦 **Package.json Completo**

```json
{
  "name": "gerador-criativos",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-helpers-nextjs": "^0.8.0",
    "@supabase/realtime-js": "^2.8.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.0.0",
    "react-dropzone": "^14.2.0",
    "openai": "^4.0.0",
    "zustand": "^4.4.0",
    "swr": "^2.2.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "lucide-react": "^0.300.0",
    "react-colorful": "^5.6.0",
    "file-saver": "^2.0.0",
    "axios": "^1.6.0",
    "uuid": "^9.0.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@types/uuid": "^9.0.0",
    "@types/lodash": "^4.14.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

## 🚀 **Instalação Rápida**

```bash
# Criar projeto
npx create-next-app@latest gerador-criativos --typescript --tailwind --eslint --app

# Instalar dependências
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/realtime-js framer-motion react-dropzone openai zustand swr react-hook-form @hookform/resolvers zod lucide-react react-colorful file-saver axios uuid date-fns lodash class-variance-authority clsx tailwind-merge tailwindcss-animate

# Instalar Shadcn/UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input textarea card dialog dropdown-menu select slider switch tabs progress badge toast checkbox label
```

## 🌍 **Deploy**

- **Frontend:** Vercel
- **Backend:** Supabase Cloud
- **Storage:** Supabase Storage
- **Database:** Supabase PostgreSQL