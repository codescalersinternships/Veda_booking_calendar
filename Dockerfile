# Use the official Docker image as a base
FROM docker:20.10.8

# Install docker-compose
RUN apk add --no-cache docker-compose

# Set the working directory
WORKDIR /app

# Copy your docker-compose.yml file into the container
COPY . .

EXPOSE 80
EXPOSE 3000

# Command to run when the container starts
CMD ["docker-compose", "up"]
