# Use the Node.js LTS image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install  --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the Next.js server will run on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
