FROM openjdk:17-slim as build

# Set a working directory for the application
WORKDIR /app

# Copy the JAR file into the container and rename it to app.jar
COPY target/user.ms-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8081

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]