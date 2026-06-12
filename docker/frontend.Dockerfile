FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY frontend/package.json ./frontend/package.json
COPY shared/package.json ./shared/package.json
RUN npm install
COPY . .
RUN npm run build -w shared && npm run build -w frontend
EXPOSE 3000
CMD ["npm", "run", "start", "-w", "frontend"]
