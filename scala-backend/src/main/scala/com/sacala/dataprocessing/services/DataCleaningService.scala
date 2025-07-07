package com.sacala.dataprocessing.services

import com.sacala.dataprocessing.models.{ProcessingResult, ProcessingStatistics}
import com.typesafe.scalalogging.LazyLogging
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics

import scala.collection.mutable
import scala.util.{Success, Try}

class DataCleaningService extends LazyLogging {

  def processData(data: List[Map[String, String]], fileName: String): ProcessingResult = {
    val startTime = System.currentTimeMillis()
    
    try {
      logger.info(s"Starting data processing for file: $fileName")
      
      // 1. Traitement des valeurs manquantes
      val (dataAfterMissing, missingCount) = handleMissingValues(data)
      logger.info(s"Handled $missingCount missing values")
      
      // 2. Détection et traitement des outliers
      val (dataAfterOutliers, outlierCount) = handleOutliers(dataAfterMissing)
      logger.info(s"Handled $outlierCount outliers")
      
      // 3. Suppression des doublons
      val (dataAfterDuplicates, duplicateCount) = removeDuplicates(dataAfterOutliers)
      logger.info(s"Removed $duplicateCount duplicates")
      
      // 4. Normalisation des données numériques
      val (finalData, normalizedColumns) = normalizeData(dataAfterDuplicates)
      logger.info(s"Normalized columns: ${normalizedColumns.mkString(", ")}")
      
      val endTime = System.currentTimeMillis()
      val processingTime = (endTime - startTime) / 1000.0
      
      val statistics = ProcessingStatistics(
        totalRows = finalData.length,
        missingValues = missingCount,
        outliers = outlierCount,
        duplicates = duplicateCount,
        normalizedColumns = normalizedColumns
      )
      
      ProcessingResult(
        originalFile = fileName,
        processedFile = s"cleaned_$fileName",
        statistics = statistics,
        processingTime = processingTime,
        status = "success"
      )
      
    } catch {
      case ex: Exception =>
        logger.error(s"Error processing data for file $fileName", ex)
        ProcessingResult(
          originalFile = fileName,
          processedFile = "",
          statistics = ProcessingStatistics(0, 0, 0, 0, List.empty),
          processingTime = 0.0,
          status = "error",
          message = Some(ex.getMessage)
        )
    }
  }

  private def handleMissingValues(data: List[Map[String, String]]): (List[Map[String, String]], Int) = {
    var missingCount = 0
    
    val cleanedData = data.map { row =>
      row.map { case (key, value) =>
        if (value == null || value.trim.isEmpty || value.toLowerCase == "null" || value.toLowerCase == "na") {
          missingCount += 1
          // Stratégie: remplacer par une valeur par défaut selon le type de colonne
          val defaultValue = inferDefaultValue(key, data)
          key -> defaultValue
        } else {
          key -> value
        }
      }
    }
    
    (cleanedData, missingCount)
  }

  private def inferDefaultValue(columnName: String, data: List[Map[String, String]]): String = {
    val validValues = data.flatMap(_.get(columnName))
      .filter(v => v != null && v.trim.nonEmpty && v.toLowerCase != "null" && v.toLowerCase != "na")
    
    if (validValues.isEmpty) return "0"
    
    // Essayer de déterminer si c'est numérique
    val numericValues = validValues.flatMap(v => Try(v.toDouble).toOption)
    
    if (numericValues.nonEmpty) {
      // Colonne numérique: utiliser la moyenne
      val mean = numericValues.sum / numericValues.length
      mean.toString
    } else {
      // Colonne textuelle: utiliser la valeur la plus fréquente
      validValues.groupBy(identity).maxBy(_._2.length)._1
    }
  }

  private def handleOutliers(data: List[Map[String, String]]): (List[Map[String, String]], Int) = {
    if (data.isEmpty) return (data, 0)
    
    val numericColumns = identifyNumericColumns(data)
    var outlierCount = 0
    
    val cleanedData = data.map { row =>
      row.map { case (key, value) =>
        if (numericColumns.contains(key)) {
          Try(value.toDouble) match {
            case Success(numValue) =>
              val columnValues = data.flatMap(_.get(key)).flatMap(v => Try(v.toDouble).toOption)
              if (isOutlier(numValue, columnValues)) {
                outlierCount += 1
                // Remplacer par la médiane
                key -> calculateMedian(columnValues).toString
              } else {
                key -> value
              }
            case _ => key -> value
          }
        } else {
          key -> value
        }
      }
    }
    
    (cleanedData, outlierCount)
  }

  private def identifyNumericColumns(data: List[Map[String, String]]): Set[String] = {
    if (data.isEmpty) return Set.empty
    
    val columns = data.head.keys.toSet
    columns.filter { column =>
      val values = data.flatMap(_.get(column)).filter(_.trim.nonEmpty)
      val numericCount = values.count(v => Try(v.toDouble).isSuccess)
      numericCount.toDouble / values.length > 0.8 // 80% des valeurs doivent être numériques
    }
  }

  private def isOutlier(value: Double, columnValues: List[Double]): Boolean = {
    if (columnValues.length < 4) return false
    
    val stats = new DescriptiveStatistics()
    columnValues.foreach(stats.addValue)
    
    val q1 = stats.getPercentile(25)
    val q3 = stats.getPercentile(75)
    val iqr = q3 - q1
    
    val lowerBound = q1 - 1.5 * iqr
    val upperBound = q3 + 1.5 * iqr
    
    value < lowerBound || value > upperBound
  }

  private def calculateMedian(values: List[Double]): Double = {
    val sorted = values.sorted
    val n = sorted.length
    if (n % 2 == 0) {
      (sorted(n/2 - 1) + sorted(n/2)) / 2.0
    } else {
      sorted(n/2)
    }
  }

  private def removeDuplicates(data: List[Map[String, String]]): (List[Map[String, String]], Int) = {
    val uniqueData = data.distinct
    val duplicateCount = data.length - uniqueData.length
    (uniqueData, duplicateCount)
  }

  private def normalizeData(data: List[Map[String, String]]): (List[Map[String, String]], List[String]) = {
    if (data.isEmpty) return (data, List.empty)
    
    val numericColumns = identifyNumericColumns(data)
    val normalizedColumns = mutable.ListBuffer[String]()
    
    val normalizedData = numericColumns.foldLeft(data) { (currentData, column) =>
      val values = currentData.flatMap(_.get(column)).flatMap(v => Try(v.toDouble).toOption)
      
      if (values.nonEmpty) {
        val min = values.min
        val max = values.max
        val range = max - min
        
        if (range > 0) {
          normalizedColumns += column
          currentData.map { row =>
            row.get(column) match {
              case Some(value) =>
                Try(value.toDouble) match {
                  case Success(numValue) =>
                    val normalized = (numValue - min) / range
                    row + (column -> normalized.toString)
                  case _ => row
                }
              case None => row
            }
          }
        } else {
          currentData
        }
      } else {
        currentData
      }
    }
    
    (normalizedData, normalizedColumns.toList)
  }
}