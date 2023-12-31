# Use a base image with Java 11
FROM openjdk:17-slim as build

# Set a working directory for the application
WORKDIR /tmp/app

# update package lists, upgrade packages, install maven
RUN apt-get update && apt-get upgrade -y && apt-get install -y maven

# Copy parent pom.xml
COPY ../pom.xml ..

# Copy project
COPY . .

# Build the project
RUN mvn clean package -DskipTests

# Use a base image with Java 17

FROM openjdk:17-slim

# Set a working directory for the application
WORKDIR /app

# Copy the JAR file from the build stage into this stage
COPY --from=build /tmp/app/target/media.ms-0.0.1-SNAPSHOT.jar app.jar

# Copy the JAR file into the container
# COPY target/media.ms-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8083

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
