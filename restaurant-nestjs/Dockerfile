FROM node:21 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:21
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env ./

RUN mkdir -p /app/logs

EXPOSE 3000
CMD ["node", "dist/main"]
