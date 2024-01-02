FROM openjdk:17-slim as build

# Set a working directory for the application
WORKDIR /app

# Copy the all of the JAR files into the container and rename it to app.jar
COPY target/*.jar app.jar


# Expose the port the app runs on
EXPOSE 8443

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
