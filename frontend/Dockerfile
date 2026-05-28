# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Use high-performance mirror for speed
RUN npm install --registry=https://registry.npmmirror.com
COPY . .
RUN npm run build

# Run Stage
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
