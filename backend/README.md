# 🛡️ Backend API

API RESTful construida con **NestJS** y **Prisma ORM**. Maneja la lógica de negocio, autenticación, gestión de usuarios y actúa.

## 🛠️ Stack Tecnológico

* **Framework:** NestJS (Node.js)
* **Lenguaje:** TypeScript
* **Base de Datos:** MySQL
* **ORM:** Prisma
* **Auth:** JWT + Passport + Bcrypt
* **Testing:** Jest

## 📋 Prerrequisitos

* Node.js v18+
* MySQL 8.0 (Corriendo localmente o en Docker)

## 🚀 Configuración del Entorno (.env)

Crea un archivo `.env` en la raíz de la carpeta `backend` con las siguientes variables:

```env
# Conexión a Base de Datos
DATABASE_URL="mysql://usuario:password@localhost:3306/aliclik_db"

# Secret para firmar los Tokens JWT (Puede ser cualquier texto largo)
JWT_SECRET="EstaEsUnaClaveSecretaMuySegura2026"

# Puerto (Opcional, por defecto 3000)
PORT=3000