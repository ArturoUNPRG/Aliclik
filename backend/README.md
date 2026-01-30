# Backend API

API RESTful desarrollada con **NestJS**, diseñada bajo el patrón **BFF (Backend for Frontend)**. Gestiona la autenticación, usuarios y la integración optimizada con PokeAPI.

## 🛠️ Stack Tecnológico

* **Framework:** NestJS
* **Base de Datos:** MySQL 8.0
* **ORM:** Prisma
* **Auth:** JWT + Bcrypt
* **Testing:** Jest
* **Infraestructura:** Docker Support

---

## 🚀 Guía de Inicio Rápido (Local)

### 1. Prerrequisitos
* Node.js v18+
* Docker Desktop (corriendo)

### 2. Levantar Base de Datos con Docker
No necesitas instalar MySQL localmente. Ejecuta este comando para levantar un contenedor con la base de datos lista:

```bash
# Levanta una instancia de MySQL 8.0 en el puerto 3306
docker run --name aliclik-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=aliclik_db -p 3306:3306 -d mysql:8.0

```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta `backend` con el siguiente contenido:

```env
# Conexión a la BD Docker que acabamos de crear
DATABASE_URL="mysql://root:root@localhost:3306/aliclik_db"

# Clave para firmar tokens (Cámbiala por seguridad)
JWT_SECRET="MiClaveSuperSecreta123"

# Puerto del servidor
PORT=3000

```

### 4. Instalación y Migraciones

Instala las dependencias y sincroniza el esquema de Prisma con la base de datos Docker.

```bash
# Instalar paquetes
npm install

# Generar cliente de Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

```

### 5. Ejecutar Servidor

```bash
# Modo Desarrollo (Watch mode)
npm run start:dev

```

*La API estará escuchando en: `http://localhost:3000*`

---

## 🧪 Ejecutar Tests (Pruebas Técnicas)

El proyecto cuenta con suites de pruebas unitarias para validar la lógica de negocio (`UsersService`) y autenticación (`AuthService`).

```bash
# Ejecutar todos los tests unitarios
npm run test

# Ver cobertura de código (Coverage)
npm run test:cov

```

---

## 🐳 Despliegue con Docker (Producción)

El proyecto incluye un `Dockerfile` optimizado para producción.

```bash
# Construir imagen
docker build -t aliclik-backend .

# Correr contenedor
docker run -p 3000:3000 aliclik-backend

```

```

```