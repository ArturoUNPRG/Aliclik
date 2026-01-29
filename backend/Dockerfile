# --- ETAPA 1: BUILDER (Construcción) ---
# Imagen ligera de Node
FROM node:20-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos TODAS las dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# Generamos el cliente de Prisma (para que Nest entienda la BD)
RUN npx prisma generate

# Compilamos el código
RUN npm run build

# --- ETAPA 2: RUNNER (Producción) ---
# Imagen limpia
FROM node:20-alpine

WORKDIR /app

# Copiamos solo lo necesario desde la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Exponemos el puerto 3000
EXPOSE 3000

# 1. Ejecuta las migraciones de BD (asegura que la BD esté al día)
# 2. Inicia la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]