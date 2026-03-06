FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma/
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src/

RUN npx prisma generate
RUN npm run build
RUN cp -r src/generated dist/src/
RUN test -f dist/src/main.js || (echo "ERROR: dist/src/main.js not found" && ls -la dist/ && ls -la dist/src/ 2>/dev/null; exit 1)

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma/
COPY --from=builder /app/dist ./dist/

RUN npm install prisma --no-save

USER node

CMD ["node", "dist/src/main.js"]
