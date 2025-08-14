# ---- build stage: Lambda Node.js 20 ----
FROM public.ecr.aws/lambda/nodejs:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src ./src

RUN npm run build && npm prune --omit=dev

# ---- runtime: Lambda ----
FROM public.ecr.aws/lambda/nodejs:20
WORKDIR ${LAMBDA_TASK_ROOT}

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# IMPORTANT: your tsconfig outputs dist/src/...
CMD [ "dist/src/handler.handler" ]
