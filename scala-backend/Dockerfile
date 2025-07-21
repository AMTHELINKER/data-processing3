# Étape 1 : Build avec SBT installé manuellement
FROM openjdk:11-jdk-slim as builder

# Installer SBT et Scala
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | tee /etc/apt/sources.list.d/sbt.list && \
    curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x99E82A75642AC823" | apt-key add && \
    apt-get update && \
    apt-get install -y sbt scala

WORKDIR /app
COPY . .

# Générer un fat JAR (nécessite sbt-assembly dans plugins.sbt)
RUN sbt clean assembly

# Étape 2 : Image d'exécution légère
FROM eclipse-temurin:11-jre
WORKDIR /app

COPY --from=builder /app/target/scala-2.13/*.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
