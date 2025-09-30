# Multi-stage build for Spring Boot application
FROM openjdk:17-jdk-slim as build

# Set working directory
WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Production stage
FROM openjdk:17-slim

# Create app user
RUN groupadd -r aquashare && useradd -r -g aquashare aquashare

# Set working directory
WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads/slides /app/uploads/logos && \
    chown -R aquashare:aquashare /app

# Switch to non-root user
USER aquashare

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
