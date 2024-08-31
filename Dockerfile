# Utiliza a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o diretório de trabalho
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta em que a aplicação estará rodando
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
