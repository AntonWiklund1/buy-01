# Use a base image with Java 11
FROM openjdk:17-slim as build

# Set a working directory for the application
WORKDIR /app

# Copy the JAR file into the container
COPY target/media.ms-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8083

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
