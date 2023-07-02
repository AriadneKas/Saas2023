# Use an official Node.js runtime as the base image
FROM node

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Expose the port on which your Express application listens
EXPOSE 9001

# Start the application
CMD [ "npm", "run", "start" ]