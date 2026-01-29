# Aliclik Fullstack Technical Test

Plataforma web para la gestión de usuarios y catálogo de Pokémon, desarrollada con una arquitectura escalable y buenas prácticas de ingeniería de software.

## Despliegue (Demo)
**🔗 Web App:** [Poner aquí tu Link generado por Dokploy]

---

## 🛠️ Stack Tecnológico

### Frontend
- **React** (Vite): SPA optimizada y rápida.
- **Redux Toolkit**: Gestión global del estado (Sesión/Auth).
- **TailwindCSS**: Diseño responsive y moderno.
- **Axios**: Cliente HTTP con interceptores.

### Backend
- **NestJS**: Framework modular y escalable.
- **Prisma ORM**: Modelado y migración de base de datos.
- **MySQL**: Base de datos relacional.
- **Cache Manager (In-Memory)**: Optimización de peticiones externas (BFF).
- **Jest**: Testing unitario.

---

## ✨ Funcionalidades Clave

1.  **Arquitectura Backend for Frontend (BFF):**
    El frontend no consume PokeAPI directamente. El backend actúa como proxy inteligente, transformando y limpiando la data.

2.  **Sistema de Caché & "Fire and Forget":**
    - Las peticiones a PokeAPI se almacenan en caché para reducir latencia.
    - Implementación de indexación en segundo plano para permitir búsquedas parciales instantáneas (ej: "pika" -> "Pikachu") sin bloquear la interfaz.

3.  **Seguridad:**
    - Autenticación JWT completa.
    - Protección de rutas (Guards).
    - Hashing de contraseñas.

4.  **CRUD Usuarios:**
    - Gestión completa de usuarios con validaciones estrictas.

---

## ⚙️ Instalación Local

### Requisitos
- Node.js v18+
- MySQL

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/aliclik-fullstack-test.git](https://github.com/TU_USUARIO/aliclik-fullstack-test.git)
cd aliclik-fullstack-test