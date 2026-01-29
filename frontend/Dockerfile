# ETAPA 1: Construcción (Build)
FROM node:18-alpine as builder

WORKDIR /app

# Copiamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el código
COPY . .

# Recibimos la variable de entorno para la construcción
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construimos la app (carpeta dist)
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine

# Copiamos los archivos construidos al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]