# Étape 1 : Build SBT
FROM hseeberger/scala-sbt:11.0.19_1.9.6_2.13 as builder

WORKDIR /app
COPY . .
RUN sbt clean assembly

# Étape 2 : Image d'exécution légère
FROM eclipse-temurin:11-jre
WORKDIR /app

# Copier le JAR généré
COPY --from=builder /app/target/scala-2.13/data-processing-api-assembly-0.1.0-SNAPSHOT.jar /app/app.jar

# Exposer le port de l'API
EXPOSE 8080

# Commande de lancement
CMD ["java", "-jar", "/app/app.jar"] 
