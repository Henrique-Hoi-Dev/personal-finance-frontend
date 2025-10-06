# Multi-stage build para otimizar tamanho da imagem final
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci --only=production=false

# Copiar código fonte
COPY . .

# Executar build do Next.js
RUN npm run build

# Criar pasta public se não existir
RUN mkdir -p public


# Estágio de produção
FROM node:20-alpine AS runner

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários para produção
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/app ./app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tailwind.config.js ./
COPY --from=builder /app/postcss.config.js ./
COPY --from=builder /app/tsconfig.json ./

# Verificar se os arquivos CSS foram copiados
RUN ls -la .next/static/css/ || echo "No CSS files found"

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Alterar propriedade dos arquivos para o usuário nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta 3000
EXPOSE 3005

# Definir variáveis de ambiente
ENV NODE_ENV=development
ENV PORT=3005
ENV NEXT_PUBLIC_API_URL=https://api.henriquehoinacki.dev
ENV NEXT_PUBLIC_APP_NAME=FinanceApp
ENV NEXT_PUBLIC_APP_VERSION=1.0.0

# Comando padrão
CMD ["npm", "run", "dev"]
