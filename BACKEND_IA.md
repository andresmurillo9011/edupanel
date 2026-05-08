# 🤖 Guía de despliegue del Backend IA
## EduClass — Servidor de planeación pedagógica

El módulo de "Planeación con IA" requiere un servidor Node.js.
Los archivos `index.js`, `auth.js`, `superadmin.js` del zip son ese servidor.

---

## Opción gratuita recomendada: Railway

1. Ve a **railway.app** → crea cuenta con GitHub
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Crea un repositorio nuevo en GitHub y sube los archivos del backend:
   - `index.js` (renombrar a `server.js` o usar como está)
   - `auth.js`
   - `superadmin.js`
   - `migration_v7.sql`
4. Railway detecta Node.js automáticamente

## Variables de entorno necesarias (Railway → Variables)

```
DATABASE_URL=postgresql://...    ← Railway te da una BD PostgreSQL gratis
JWT_SECRET=tu_clave_secreta_aqui
GROQ_KEY=gsk_...                 ← API key de groq.com (gratis)
TOGETHER_KEY=...                 ← Opcional: together.ai
GEMINI_KEY=...                   ← Opcional: Google AI Studio (gratis)
PORT=5000
```

## Obtener API key de IA (GRATIS)

### Groq (recomendado — muy rápido y gratis):
1. Ve a **console.groq.com**
2. Crea cuenta → **API Keys** → **Create API Key**
3. Copia la clave `gsk_...`

### Google Gemini (alternativa gratis):
1. Ve a **aistudio.google.com**
2. **"Get API key"** → copia la clave

## Conectar con EduPanel

Cuando Railway despliegue el servidor, te dará una URL tipo:
```
https://tu-proyecto.up.railway.app
```

Abre `planeacion.html` y cambia la línea:
```javascript
const API = "https://tu-backend.railway.app"; // ← CAMBIAR por tu URL real
```

Por ejemplo:
```javascript
const API = "https://edupanel-ia.up.railway.app";
```

Luego sube el cambio a GitHub:
```bash
git add planeacion.html
git commit -m "Conectar planeacion IA con backend Railway"
git push
```

---

## Base de datos

Railway incluye PostgreSQL gratuito. El archivo `migration_v7.sql` crea las tablas.
En Railway: **Data** → **PostgreSQL** → copia el `DATABASE_URL` y ponlo en variables.

Para ejecutar la migración:
```bash
npx prisma db push
# o si tienes el archivo SQL:
psql $DATABASE_URL < migration_v7.sql
```

---

## Costo estimado

- Railway: **gratis** hasta 500 horas/mes (suficiente para uso escolar)
- Groq API: **completamente gratis** con límites generosos
- Total: **$0**

---

*EduPanel v2.0 + EduClass IA · I.E.R. Santiago de la Selva · 2026*
