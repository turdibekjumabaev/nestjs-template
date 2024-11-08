# Stage 1: development Stage
FROM node:22.11-alpine3.20 AS development

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./

# Set environment variables
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV SHELL=/bin/sh

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build



# Stage 2: Production Stage
FROM node:22.11-alpine3.20 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./

# Install pnpm and production dependencies
RUN npm install -g pnpm && pnpm install --prod

COPY . .

# Copy build files from development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
