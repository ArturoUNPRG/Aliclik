# Frontend Client

Cliente web SPA (Single Page Application) desarrollado con **React** y **Vite**. Se conecta al Backend BFF para ofrecer una experiencia de usuario fluida, gestión de sesión segura y visualización de datos en tiempo real.

## 🛠️ Stack Tecnológico

* **Core:** React 18 + TypeScript
* **Build Tool:** Vite
* **State Management:** Redux Toolkit (Auth & Users Slices)
* **Styling:** TailwindCSS
* **HTTP Client:** Axios (con Interceptores para Tokens)
* **Routing:** React Router DOM v6

---

## 🚀 Guía de Inicio Rápido (Local)

### 1. Prerrequisitos
* Node.js v18+
* **Importante:** El Backend debe estar ejecutándose en el puerto `3000` antes de iniciar el frontend.

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz de la carpeta `frontend` para apuntar a tu API local:

```env
# URL del Backend local (NestJS)
VITE_API_URL="http://localhost:3000"

```

### 3. Instalación de Dependencias

```bash
npm install

```

### 4. Ejecutar en Modo Desarrollo

Inicia el servidor local con Hot Module Replacement (HMR).

```bash
npm run dev

```

*La aplicación estará disponible en: `http://localhost:5173*`

---

## 📦 Construcción para Producción

Para generar los archivos estáticos optimizados que serán servidos por Nginx o cualquier servidor web:

```bash
npm run build

```

Esto generará una carpeta `dist/` con el código minificado y optimizado.

---

## 🐳 Despliegue con Docker (Producción)

El proyecto incluye un `Dockerfile` multi-stage que utiliza Nginx Alpine para servir la aplicación.

```bash
# Construir imagen
docker build -t aliclik-frontend .

# Correr contenedor (Puerto 80)
docker run -p 80:80 aliclik-frontend

```

---

## 📂 Estructura del Proyecto

* `src/api`: Configuración de Axios.
* `src/components`: Componentes UI reutilizables.
* `src/layouts`: Estructuras de página (Dashboard, Auth).
* `src/pages`: Vistas principales.
* `src/store`: Configuración de Redux.
* `src/hooks`: Custom hooks.

```

```