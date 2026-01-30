## 🌐 Demo Desplegado

La aplicación se encuentra desplegada en un servidor VPS utilizando **Docker** y **Traefik** como Reverse Proxy.

### 👉 **[ACCEDER A LA PLATAFORMA WEB](https://bots-aliclikfrontend-7rzjkj-8d0617-62-146-230-42.traefik.me/)**

> **Credenciales de Acceso (Admin):**
> * **Email:** `arturo@aliclik.app`
> * **Password:** `admin123`
>
> *Nota: También puedes registrar una nueva cuenta desde la pantalla de login.*

---

## 🛠️ Arquitectura y Tecnologías

El proyecto sigue una estructura de **Monorepo** para mantener la coherencia entre el cliente y el servidor.

### 🎨 Frontend (Cliente)
Aplicación SPA reactiva optimizada para UX/UI.
* **Core:** React 18 + Vite + TypeScript.
* **Estado:** Redux Toolkit (Manejo robusto de sesión Auth y persistencia).
* **Estilos:** TailwindCSS (Diseño Responsive Mobile-First).
* **HTTP:** Axios (Interceptores para manejo global de errores y Tokens).
* **Seguridad:** Rutas protegidas (`ProtectedRoute`) y redirecciones inteligentes.

### 🧱 Backend (Servidor)
API RESTful modular diseñada para escalabilidad.
* **Framework:** NestJS (Node.js).
* **Base de Datos:** MySQL 8.0 hospedada en Docker.
* **ORM:** Prisma (Tipado estricto, migraciones y seguridad).
* **Patrón BFF:** Actúa como intermediario entre el cliente y PokeAPI, transformando y limpiando los datos.
* **Testing:** Jest (Pruebas unitarias para Servicios y Controladores).

---

## ✨ Funcionalidades Implementadas

### 1. 🔐 Seguridad y Autenticación
* **JWT Strategy:** Implementación completa de JSON Web Tokens con expiración.
* **Hashing:** Las contraseñas se encriptan con `bcrypt` antes de tocar la base de datos.
* **Guards:** Protección de endpoints críticos en el Backend.
* **Blindaje:** El servicio de usuarios protege la información sensible (nunca devuelve passwords en las respuestas).

### 2. 👥 Gestión de Usuarios (CRUD)
* Registro de usuarios con validación de correos duplicados.
* Edición de perfil y cambio de contraseña seguro.
* Listado de usuarios (solo para roles autorizados).
* Manejo de errores HTTP correctos (404 Not Found, 409 Conflict, 401 Unauthorized).

### 3. ⚡ Módulo Pokémon (Integración Externa)
* **Consumo API Externa:** Integración con `pokeapi.co`.
* **Optimización:** Paginación controlada desde el servidor.
* **Resiliencia:** Manejo de fallos en la API externa para no romper la aplicación cliente.

---

## ⚙️ Instrucciones de Instalación Local

Si deseas ejecutar el proyecto en tu entorno local, sigue estos pasos:

### Prerrequisitos
* Node.js v18 o superior.
* Docker (opcional, para la BD) o un servidor MySQL local.

### 1. Clonar el repositorio
```bash
git clone <git@github.com:ArturoUNPRG/Aliclik.git>
cd aliclik-fullstack-test