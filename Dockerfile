# Étape 1 : installation des dépendances + build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : exécution du serveur Node Astro (SSR, nécessaire pour /api/contact)
FROM node:20-alpine AS runtime
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=4322
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 4322
CMD ["node", "./dist/server/entry.mjs"]
