FROM node:24.13.1-alpine as builder

# Create app directory
WORKDIR /app

COPY package*.json yarn.lock ./
COPY .docker ./.docker/

# Install app dependencies (keep devDependencies for local tools like drizzle-kit)
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


FROM node:24.13.1-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/.docker ./.docker

RUN chmod +x .docker/entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ ".docker/entrypoint.sh" ]
