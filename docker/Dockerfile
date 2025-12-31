FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npx playwright install chromium --with-deps

COPY . .

RUN chmod -R 777 /app

CMD ["npm", "test"]
