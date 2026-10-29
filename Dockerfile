FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=corporate_ca node -e "const fs=require('fs'),cp=require('child_process');const ca='/run/secrets/corporate_ca';const result=cp.spawnSync('npm',['ci'],{stdio:'inherit',env:{...process.env,...(fs.existsSync(ca)?{NODE_EXTRA_CA_CERTS:ca}:{})}});process.exit(result.status??1)"
COPY . .
ARG API_INTERNAL_URL=http://api:4000
ENV API_INTERNAL_URL=$API_INTERNAL_URL NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-bookworm-slim
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
