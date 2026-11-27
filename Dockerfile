# Networkdoc_ – App und kleiner Speicher-Server in einem Container
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    DATA_DIR=/data

COPY package.json ./
COPY scripts ./scripts
COPY src ./src
COPY server ./server

# Die App ist eine einzelne HTML-Datei – sie wird hier aus src/ zusammengebaut, ohne npm-Pakete.
RUN node scripts/build.mjs \
 && mkdir -p /data \
 && chown -R node:node /data

USER node
EXPOSE 8080
VOLUME ["/data"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["node", "server/server.js"]
