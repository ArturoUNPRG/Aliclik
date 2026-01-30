# ETAPA 1: Construcción
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Recibimos la variable de entorno desde Dokploy
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ETAPA 2: Servidor Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración para que React Router funcione¿
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]