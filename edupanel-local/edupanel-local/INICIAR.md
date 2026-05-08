# 🌿 EduPanel + Planeación IA — Instalación Local

## Requisitos
- Node.js 18+ instalado (descargar en nodejs.org)

## Pasos para iniciar

1. Copia la carpeta `edupanel-local` a tu PC
2. Renombra `.env.example` a `.env`  
3. Abre el archivo `.env` y agrega tu clave de IA:
   - Ve a **console.groq.com** → registro gratis → copia la clave `gsk_...`
   - Pégala: `GROQ_KEY=gsk_xxxxxxxx`
4. Abre una terminal en la carpeta y ejecuta:
   ```
   npm install
   npm start
   ```
5. Abre el navegador en: **http://localhost:3000/login.html**

## Páginas

| URL | Descripción |
|-----|-------------|
| http://localhost:3000/login.html | Entrada al sistema |
| http://localhost:3000/horario.html | Horario de clases |
| http://localhost:3000/admin.html | Panel de administración |
| http://localhost:3000/planeacion.html | Planeación con IA |

## Credenciales por defecto
- **Usuario:** admin  
- **Contraseña:** admin123

## ¿Problemas?
- Asegúrate que el puerto 3000 esté libre
- Si dice "puerto en uso": cierra otras terminales o cambia PORT=3001 en .env
