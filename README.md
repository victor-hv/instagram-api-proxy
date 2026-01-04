# 🚀 Instagram API Proxy - Vercel

API própria para buscar dados do Instagram sem depender de terceiros!

## 📋 O Que Faz:

- ✅ Busca perfil do Instagram
- ✅ Username, bio, seguidores, seguindo
- ✅ Foto de perfil
- ✅ Posts count
- ✅ 100% GRÁTIS
- ✅ Sem limites

## 🔧 Como Fazer Deploy:

### **1. Instalar Vercel CLI:**

```bash
npm install -g vercel
```

### **2. Fazer Login:**

```bash
vercel login
```

### **3. Fazer Deploy:**

```bash
cd vercel-api
vercel --prod
```

### **4. Vai aparecer:**

```
✅ Production: https://seu-projeto.vercel.app
```

## 🧪 Como Testar:

```
https://seu-projeto.vercel.app/api/profile?username=badgallore
```

## 📡 Endpoints:

### **GET /api/profile**

**Parâmetros:**
- `username` - Username do Instagram (sem @)

**Exemplo:**
```
GET https://seu-projeto.vercel.app/api/profile?username=badgallore
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "pk": "294452354",
    "username": "badgallore",
    "full_name": "Lorena Maria",
    "biography": "💌 badgallore@mynd8.com.br",
    "profile_pic_url": "https://...",
    "is_private": false,
    "is_verified": true,
    "is_business": false,
    "media_count": 541,
    "follower_count": 6361118,
    "following_count": 1236,
    "external_url": "https://...",
    "category": "Artist"
  }
}
```

## 🔒 Segurança:

- ✅ CORS habilitado
- ✅ Timeout de 15s
- ✅ Rate limit do Vercel (automático)
- ✅ Fallback se método principal falhar

## 💡 Como Usar no Seu Site:

```javascript
async function buscarPerfil(username) {
  const response = await fetch(`https://seu-projeto.vercel.app/api/profile?username=${username}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('Perfil:', data.data);
  } else {
    console.error('Erro:', data.error);
  }
}
```

## 📦 Estrutura:

```
vercel-api/
├── api/
│   └── profile.js    ← Endpoint principal
├── package.json      ← Dependências
├── vercel.json       ← Config do Vercel
└── README.md         ← Este arquivo
```

## ⚡ Vantagens:

- 🆓 **Grátis** (Vercel Free Tier)
- 🚀 **Rápido** (Edge Network global)
- 🔄 **Escalável** (Auto-scaling)
- 🛡️ **Seguro** (HTTPS automático)
- 📊 **Analytics** (Dashboard do Vercel)

## 🎯 Próximos Passos:

Você pode adicionar mais endpoints:
- `/api/followers` - Buscar seguidores
- `/api/posts` - Buscar posts
- `/api/stories` - Buscar stories

## 🐛 Troubleshooting:

**Erro "Username não encontrado":**
- Verifica se o username está correto
- Testa com perfil público primeiro

**Erro de timeout:**
- Instagram pode estar bloqueando
- Tente novamente em alguns minutos

**Rate limit:**
- Vercel Free: 100GB bandwidth/mês
- ~1 milhão de requisições/mês

## 📝 Notas:

- Instagram pode bloquear se fizer MUITAS requisições
- Use cache no frontend para reduzir chamadas
- Respeite os limites do Instagram
