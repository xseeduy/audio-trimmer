FROM node:18-slim

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy source
COPY index.js .

EXPOSE 3000
CMD ["node", "index.js"]
