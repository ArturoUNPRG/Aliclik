# 1. Usamos una imagen ligera de Node.js 18
FROM node:18-alpine
RUN apk add --no-cache openssl libc6-compat

# 2. Creamos la carpeta de trabajo
WORKDIR /app

# 3. Copiamos los archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalamos dependencias
RUN npm ci

# 5. Generamos el cliente de Prisma (Base de datos)
RUN npx prisma generate

# 6. Copiamos el resto del código
COPY . .

# 7. Construimos la aplicación
RUN npm run build

# 8. Exponemos el puerto
EXPOSE 3000

# 9. Comando de arranque (incluye migración de DB por seguridad)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]