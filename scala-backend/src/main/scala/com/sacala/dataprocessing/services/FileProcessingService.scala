package com.sacala.dataprocessing.services

import com.github.tototoshi.csv._
import com.typesafe.scalalogging.LazyLogging
import spray.json._

import java.io.StringReader
import scala.util.{Failure, Success, Try}
import scala.xml.XML

class FileProcessingService extends LazyLogging {

  def parseFile(content: String, fileType: String): Try[List[Map[String, String]]] = {
    fileType.toLowerCase match {
      case "csv" => parseCsv(content)
      case "json" => parseJson(content)
      case "xml" => parseXml(content)
      case _ => Failure(new IllegalArgumentException(s"Unsupported file type: $fileType"))
    }
  }

  private def parseCsv(content: String): Try[List[Map[String, String]]] = {
    Try {
      val reader = CSVReader.open(new StringReader(content))
      val lines = reader.allWithHeaders()
      reader.close()
      
      lines.map(_.map { case (k, v) => k -> (if (v == null) "" else v) })
    }
  }

  private def parseJson(content: String): Try[List[Map[String, String]]] = {
    Try {
      val json = content.parseJson
      
      json match {
        case JsArray(elements) =>
          elements.map {
            case JsObject(fields) =>
              fields.map { case (key, value) =>
                key -> valueToString(value)
              }.toMap
            case _ => throw new IllegalArgumentException("JSON array must contain objects")
          }.toList
          
        case JsObject(fields) =>
          List(fields.map { case (key, value) =>
            key -> valueToString(value)
          }.toMap)
          
        case _ => throw new IllegalArgumentException("JSON must be an object or array of objects")
      }
    }
  }

  private def parseXml(content: String): Try[List[Map[String, String]]] = {
    Try {
      val xml = XML.loadString(content)
      val records = (xml \\ "record").toList
      
      if (records.nonEmpty) {
        records.map { record =>
          record.child.filter(_.isInstanceOf[scala.xml.Elem]).map { elem =>
            elem.label -> elem.text
          }.toMap
        }
      } else {
        // Si pas de structure "record", essayer de traiter le XML comme un seul enregistrement
        List(xml.child.filter(_.isInstanceOf[scala.xml.Elem]).map { elem =>
          elem.label -> elem.text
        }.toMap)
      }
    }
  }

  private def valueToString(value: JsValue): String = {
    value match {
      case JsString(s) => s
      case JsNumber(n) => n.toString
      case JsBoolean(b) => b.toString
      case JsNull => ""
      case _ => value.toString
    }
  }

  def generateCsv(data: List[Map[String, String]]): String = {
    if (data.isEmpty) return ""
    
    val headers = data.head.keys.toList.sorted
    val csvContent = new StringBuilder()
    
    // Headers
    csvContent.append(headers.mkString(","))
    csvContent.append("\n")
    
    // Data rows
    data.foreach { row =>
      val values = headers.map(header => row.getOrElse(header, ""))
      csvContent.append(values.map(escapeCSV).mkString(","))
      csvContent.append("\n")
    }
    
    csvContent.toString()
  }

  private def escapeCSV(value: String): String = {
    if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
      "\"" + value.replace("\"", "\"\"") + "\""
    } else {
      value
    }
  }
}