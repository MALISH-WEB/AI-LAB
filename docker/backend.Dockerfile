FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY backend/package.json ./backend/package.json
COPY shared/package.json ./shared/package.json
RUN npm install
COPY . .
RUN npm run build -w shared && npm run build -w backend
EXPOSE 4000
CMD ["npm", "run", "start", "-w", "backend"]
