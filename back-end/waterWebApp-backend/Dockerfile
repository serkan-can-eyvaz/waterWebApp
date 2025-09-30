# Dockerfile

FROM openjdk:17-slim

WORKDIR /app

# mvnw ve .mvn kopyalama yerine sadece jar dosyasını kopyala
COPY target/waterWebApp-backend-0.0.1-SNAPSHOT.jar app.jar

# Kullanıcı oluşturma opsiyonel
# RUN groupadd -r aquashare && useradd -r -g aquashare aquashare

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
