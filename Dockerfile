# Use an official Node.js runtime as a parent image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g nodemon && npm install

# Copy the rest of your app files (including src/, .env, etc.)
COPY . .

# Set working directory to your source folder
WORKDIR /app/src

# Expose the port your Hapi server listens on
EXPOSE 5000

# Command to start your app
CMD ["npm", "run", "dev"]
