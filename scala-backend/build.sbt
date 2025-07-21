ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.13.12"

lazy val root = (project in file("."))
  .settings(
    name := "data-processing-api",
    libraryDependencies ++= Seq(
      // Akka HTTP pour l'API REST
      "com.typesafe.akka" %% "akka-http" % "10.5.3",
      "com.typesafe.akka" %% "akka-stream" % "2.8.5",
      "com.typesafe.akka" %% "akka-actor-typed" % "2.8.5",
      
      // JSON support
      "com.typesafe.akka" %% "akka-http-spray-json" % "10.5.3",
      "io.spray" %% "spray-json" % "1.3.6",
      
      // CSV processing
      "com.github.tototoshi" %% "scala-csv" % "1.3.10",
      
      // XML processing
      "org.scala-lang.modules" %% "scala-xml" % "2.2.0",
      
      // Statistics and data processing
      "org.apache.commons" % "commons-math3" % "3.6.1",
      
      // Configuration
      "com.typesafe" % "config" % "1.4.3",
      
      // Logging
      "ch.qos.logback" % "logback-classic" % "1.4.11",
      "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
      
      // Ajout CORS
      "ch.megard" %% "akka-http-cors" % "1.1.3",
      
      // Testing
      "org.scalatest" %% "scalatest" % "3.2.17" % Test,
      "com.typesafe.akka" %% "akka-http-testkit" % "10.5.3" % Test,
      "com.typesafe.akka" %% "akka-testkit" % "2.8.5" % Test
    ),
    assembly / assemblyMergeStrategy := {
      case PathList("META-INF", _*) => MergeStrategy.discard
      case "module-info.class" => MergeStrategy.discard
      case x =>
        val oldStrategy = (assembly / assemblyMergeStrategy).value
        oldStrategy(x)
    }
  )
