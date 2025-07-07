package com.sacala.dataprocessing

import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.Behaviors
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import com.sacala.dataprocessing.routes.DataProcessingRoutes
import com.sacala.dataprocessing.services.{DataCleaningService, FileProcessingService}
import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._

import scala.concurrent.ExecutionContextExecutor
import scala.util.{Failure, Success}

object Main extends App with LazyLogging {
  
  implicit val system: ActorSystem[Nothing] = ActorSystem(Behaviors.empty, "data-processing-api")
  implicit val executionContext: ExecutionContextExecutor = system.executionContext
  
  val config = ConfigFactory.load()
  val host = config.getString("server.host")
  val port = config.getInt("server.port")
  
  // Services
  val fileProcessingService = new FileProcessingService()
  val dataCleaningService = new DataCleaningService()
  
  // Routes
  val routes = new DataProcessingRoutes(fileProcessingService, dataCleaningService).routes
  
  // CORS support
  val corsRoutes = cors() {
    routes
  }
  
  // Start server
  val bindingFuture = Http().newServerAt(host, port).bind(corsRoutes)
  
  bindingFuture.onComplete {
    case Success(binding) =>
      logger.info(s"Server online at http://$host:$port/")
      logger.info("Press RETURN to stop...")
    case Failure(ex) =>
      logger.error("Failed to bind HTTP endpoint", ex)
      system.terminate()
  }
  
  // Graceful shutdown
  scala.io.StdIn.readLine()
  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())
}