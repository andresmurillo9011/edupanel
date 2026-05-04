# 🚀 Guía de Despliegue en GitHub Pages
## EduPanel — Horario Académico Interactivo

---

## 📁 Archivos del proyecto

```
edupanel/
├── index.html      ← Horario principal
├── login.html      ← Pantalla de inicio de sesión
├── admin.html      ← Panel de administración
├── styles.css      ← Estilos globales
├── login.css       ← Estilos del login
├── admin.css       ← Estilos del admin
├── data.js         ← Horario y configuración estática
├── auth.js         ← Sistema de autenticación y roles
├── storage.js      ← Capa de persistencia (localStorage → Supabase)
├── app.js          ← Lógica del horario interactivo
├── admin.js        ← Lógica del panel de administración
└── DEPLOY.md       ← Este archivo
```

---

## ✅ Paso 1 — Crear cuenta en GitHub

1. Ve a https://github.com
2. Crea una cuenta gratuita (si no tienes)

---

## ✅ Paso 2 — Crear repositorio

1. Haz clic en el botón verde **"New"** (o el `+` arriba a la derecha)
2. Nombre del repositorio: `edupanel` (o el que prefieras)
3. Marca **"Public"** (necesario para GitHub Pages gratis)
4. Haz clic en **"Create repository"**

---

## ✅ Paso 3 — Subir los archivos

### Opción A — Desde el navegador (más fácil):

1. En tu repositorio vacío, haz clic en **"uploading an existing file"**
2. Arrastra TODOS los archivos de tu carpeta `edupanel/`
3. En "Commit changes" escribe: `Primera versión de EduPanel`
4. Haz clic en **"Commit changes"**

### Opción B — Con Git (terminal):
```bash
cd carpeta-edupanel
git init
git add .
git commit -m "Primera versión EduPanel"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/edupanel.git
git push -u origin main
```

---

## ✅ Paso 4 — Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (pestaña arriba)
2. En el menú izquierdo, busca **"Pages"**
3. En "Source", selecciona **"Deploy from a branch"**
4. En "Branch", elige **main** y **/ (root)**
5. Haz clic en **"Save"**

⏳ Espera 1-2 minutos...

---

## ✅ Paso 5 — Tu URL pública

Tu aplicación estará disponible en:

```
https://TU_USUARIO.github.io/edupanel/login.html
```

**¡Comparte esa URL con tus docentes!**

---

## 👥 Acceso al sistema

| Usuario | Contraseña | Rol | Acceso |
|---------|------------|-----|--------|
| `admin` | *(confidencial)* | Administrador | Todo el sistema |
| *(docentes)* | *(asignada por admin)* | Docente | Solo sus grados y materias |

> ⚠️ Las credenciales son **confidenciales**. Solo el administrador las conoce y gestiona.
> Para recuperar o crear acceso: comunicarse con el administrador del sistema.

## 👥 Total estudiantes cargados automáticamente

| Grado | Cantidad |
|-------|----------|
| 6° | 15 estudiantes |
| 7° | 12 estudiantes |
| 8° | 8 estudiantes |
| 9° | 8 estudiantes |
| 10° | 5 estudiantes |
| 11° | 15 estudiantes |
| **Total** | **63 estudiantes** |

Fuente: SIMAT 2026 · I.E.R. Santiago de la Selva · Valparaíso, Caquetá

---

## ➕ Agregar un nuevo docente

1. Entra con `admin` / `admin123`
2. Ve a **Admin** (botón en el header)
3. Clic en **"+ Nuevo docente"**
4. Llena: nombre, usuario, contraseña, email
5. Marca los **grados** y **materias** que puede ver
6. Guarda

El docente solo verá las celdas de sus grados y materias. Las demás aparecen con 🔒.

---

## 📋 Agregar estudiantes

### Manual (uno por uno):
1. Admin → Estudiantes
2. Seleccionar grado
3. "+ Agregar estudiante"

### Masivo (CSV):
1. Crea un archivo `.csv` o `.txt` con los nombres, uno por línea:
```
Juan Pérez
María López
Carlos García
Ana Martínez
```
2. Admin → Estudiantes → "⬆ Importar CSV"
3. Sube el archivo o pega el texto

---

## 📚 Cargar Malla Curricular

1. Admin → Malla Curricular
2. Selecciona materia y grado
3. Escribe los temas por período (uno por línea)
4. Guarda

Los docentes verán el próximo tema sugerido en cada celda del horario.

---

## 💾 Sobre los datos

Actualmente los datos se guardan en **localStorage** del navegador.

**Importante:** localStorage es por dispositivo y navegador. Si el docente 
cambia de computador o borra el caché, pierde los datos.

### 🔧 Para datos compartidos entre docentes → Supabase (gratis)

1. Crea cuenta en https://supabase.com
2. Crea un proyecto nuevo
3. En `storage.js`, reemplaza cada método con la query Supabase 
   que está comentada con `// TODO Supabase:`
4. En `auth.js`, reemplaza el sistema de usuarios con Supabase Auth

---

## 🔄 Actualizar la app

Cuando hagas cambios a los archivos:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

GitHub Pages se actualiza automáticamente en 1-2 minutos.

---

## 🆘 Problemas comunes

| Problema | Solución |
|----------|----------|
| La página muestra error 404 | Asegúrate de que el repositorio sea **Public** |
| No carga los estilos | Verifica que todos los archivos .css estén subidos |
| Los datos no se guardan entre docentes | Necesitas Supabase (ver arriba) |
| Olvidé la contraseña del admin | Abre la consola del navegador (F12) y ejecuta: `localStorage.removeItem('edupanel_users')` luego recarga |

---

## 📞 Soporte

Para conectar con Supabase y tener datos sincronizados entre todos los 
docentes, busca un desarrollador que implemente el backend — el código 
ya está preparado con los comentarios `// TODO Supabase:`.

---

*EduPanel v2.0 · I.E.R. Santiago de la Selva · Valparaíso, Caquetá · 2026*
