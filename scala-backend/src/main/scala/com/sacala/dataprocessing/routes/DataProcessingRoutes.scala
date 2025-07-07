package com.sacala.dataprocessing.routes

import akka.http.scaladsl.model._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.sacala.dataprocessing.models.JsonFormats._
import com.sacala.dataprocessing.models.{ProcessingRequest, ProcessingStatus}
import com.sacala.dataprocessing.services.{DataCleaningService, FileProcessingService}
import com.typesafe.scalalogging.LazyLogging
import spray.json._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.headers.{`Content-Disposition`, ContentDispositionTypes}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

class DataProcessingRoutes(
  fileProcessingService: FileProcessingService,
  dataCleaningService: DataCleaningService
)(implicit ec: ExecutionContext) extends LazyLogging {

  val routes: Route = {
    pathPrefix("api") {
      concat(
        // Health check
        path("health") {
          get {
            complete(StatusCodes.OK -> "API is running")
          }
        },
        
        // Process data
        path("process") {
          post {
            entity(as[String]) { requestBody =>
              try {
                val request = requestBody.parseJson.convertTo[ProcessingRequest]
                
                val processingFuture = Future {
                  fileProcessingService.parseFile(request.data, request.fileType) match {
                    case Success(parsedData) =>
                      logger.info(s"Successfully parsed ${request.fileName} with ${parsedData.length} records")
                      dataCleaningService.processData(parsedData, request.fileName)
                      
                    case Failure(ex) =>
                      logger.error(s"Failed to parse file ${request.fileName}", ex)
                      throw ex
                  }
                }
                
                onComplete(processingFuture) {
                  case Success(result) =>
                    complete(result.toJson)
                  case Failure(ex) =>
                    logger.error("Processing failed", ex)
                    complete(Map("error" -> ex.getMessage).toJson)
                }
                
              } catch {
                case ex: Exception =>
                  logger.error("Invalid request format", ex)
                  complete(Map("error" -> "Invalid request format").toJson)
              }
            }
          }
        },
        
        // Get processing status
        path("status" / Segment) { id =>
          get {
            // Simulation du statut de traitement
            val status = ProcessingStatus(
              id = id,
              status = "completed",
              progress = 100,
              currentStep = "Normalisation terminée"
            )
            complete(status.toJson)
          }
        },
        
        // Download processed file
        path("download" / Segment) { id =>
          get {
            // Simulation du téléchargement
            val csvContent = "name,age,salary\nJohn,25,50000\nJane,30,60000"
            
            respondWithHeaders(
              headers.`Content-Disposition`(ContentDispositionTypes.attachment, Map("filename" -> s"processed_$id.csv"))
            ) {
              complete(HttpEntity(ContentTypes.`text/csv(UTF-8)`, csvContent))
            }
          }
        }
      )
    }
  }
}