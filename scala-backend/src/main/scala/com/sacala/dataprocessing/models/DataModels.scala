package com.sacala.dataprocessing.models

import spray.json._

case class ProcessingRequest(
  fileName: String,
  fileType: String,
  data: String
)

case class ProcessingResult(
  originalFile: String,
  processedFile: String,
  statistics: ProcessingStatistics,
  processingTime: Double,
  status: String,
  message: Option[String] = None
)

case class ProcessingStatistics(
  totalRows: Int,
  missingValues: Int,
  outliers: Int,
  duplicates: Int,
  normalizedColumns: List[String]
)

case class ProcessingStatus(
  id: String,
  status: String,
  progress: Int,
  currentStep: String
)

// JSON formatters
object JsonFormats extends DefaultJsonProtocol {
  implicit val processingStatisticsFormat: RootJsonFormat[ProcessingStatistics] = jsonFormat5(ProcessingStatistics)
  implicit val processingResultFormat: RootJsonFormat[ProcessingResult] = jsonFormat6(ProcessingResult)
  implicit val processingRequestFormat: RootJsonFormat[ProcessingRequest] = jsonFormat3(ProcessingRequest)
  implicit val processingStatusFormat: RootJsonFormat[ProcessingStatus] = jsonFormat4(ProcessingStatus)
}