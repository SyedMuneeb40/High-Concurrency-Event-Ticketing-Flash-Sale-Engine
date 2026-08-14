FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/*.jar app.jar
COPY Uploads ./Uploads

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]