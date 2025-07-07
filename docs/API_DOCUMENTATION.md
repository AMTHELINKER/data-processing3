# Documentation API - Sacala DIC2

## Vue d'ensemble

L'API de traitement de données Sacala DIC2 fournit des endpoints RESTful pour automatiser le nettoyage et la normalisation des données.

## Base URL

```
http://localhost:8080/api
```

## Authentification

Actuellement, l'API ne nécessite pas d'authentification. Pour un environnement de production, il est recommandé d'implémenter une authentification par token.

## Endpoints

### 1. Health Check

**GET** `/health`

Vérifie que l'API est opérationnelle.

**Response:**
```
Status: 200 OK
Body: "API is running"
```

### 2. Traitement de Données

**POST** `/process`

Traite un fichier de données et retourne les statistiques de nettoyage.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fileName": "string",     // Nom du fichier
  "fileType": "string",     // Type: "csv", "json", ou "xml"
  "data": "string"          // Contenu du fichier en string
}
```

**Response Success (200):**
```json
{
  "originalFile": "data.csv",
  "processedFile": "cleaned_data.csv",
  "statistics": {
    "totalRows": 1250,
    "missingValues": 45,
    "outliers": 12,
    "duplicates": 8,
    "normalizedColumns": ["age", "salary", "score"]
  },
  "processingTime": 2.8,
  "status": "success"
}
```

**Response Error (400/500):**
```json
{
  "error": "Description de l'erreur"
}
```

### 3. Statut de Traitement

**GET** `/status/{id}`

Récupère le statut d'un traitement en cours.

**Parameters:**
- `id` (path): Identifiant unique du traitement

**Response:**
```json
{
  "id": "12345",
  "status": "processing|completed|error",
  "progress": 75,
  "currentStep": "Détection des outliers"
}
```

### 4. Téléchargement

**GET** `/download/{id}`

Télécharge le fichier traité.

**Parameters:**
- `id` (path): Identifiant unique du fichier

**Response:**
```
Status: 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="processed_data.csv"
Body: [Contenu CSV du fichier traité]
```

## Formats de Fichiers Supportés

### CSV (Comma Separated Values)

**Format d'entrée:**
```csv
name,age,salary,department
John Doe,25,50000,IT
Jane Smith,30,60000,HR
Bob Johnson,,45000,IT
```

**Caractéristiques:**
- Séparateur: virgule (,)
- Première ligne: headers
- Encodage: UTF-8

### JSON (JavaScript Object Notation)

**Format d'entrée (Array):**
```json
[
  {"name": "John Doe", "age": 25, "salary": 50000, "department": "IT"},
  {"name": "Jane Smith", "age": 30, "salary": 60000, "department": "HR"},
  {"name": "Bob Johnson", "age": null, "salary": 45000, "department": "IT"}
]
```

**Format d'entrée (Object):**
```json
{
  "name": "John Doe",
  "age": 25,
  "salary": 50000,
  "department": "IT"
}
```

### XML (eXtensible Markup Language)

**Format d'entrée:**
```xml
<data>
  <record>
    <name>John Doe</name>
    <age>25</age>
    <salary>50000</salary>
    <department>IT</department>
  </record>
  <record>
    <name>Jane Smith</name>
    <age>30</age>
    <salary>60000</salary>
    <department>HR</department>
  </record>
</data>
```

## Algorithmes de Traitement

### 1. Valeurs Manquantes

**Détection:**
- Valeurs null, vides, "null", "na", "N/A"

**Traitement:**
- **Colonnes numériques**: Remplacement par la moyenne
- **Colonnes textuelles**: Remplacement par la valeur la plus fréquente

### 2. Outliers (Valeurs Aberrantes)

**Méthode:** IQR (Interquartile Range)

**Calcul:**
```
Q1 = 25ème percentile
Q3 = 75ème percentile
IQR = Q3 - Q1
Limite inférieure = Q1 - 1.5 × IQR
Limite supérieure = Q3 + 1.5 × IQR
```

**Traitement:** Remplacement par la médiane

### 3. Doublons

**Détection:** Comparaison ligne par ligne (tous les champs)

**Traitement:** Suppression des doublons, conservation de la première occurrence

### 4. Normalisation

**Méthode:** Min-Max Scaling

**Formule:**
```
normalized_value = (value - min) / (max - min)
```

**Résultat:** Valeurs comprises entre 0 et 1

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 200  | Succès |
| 400  | Requête invalide (format, type de fichier non supporté) |
| 413  | Fichier trop volumineux (> 100MB) |
| 500  | Erreur interne du serveur |

## Limites

- **Taille de fichier**: 100MB maximum
- **Timeout**: 60 secondes par requête
- **Formats**: CSV, JSON, XML uniquement
- **Encodage**: UTF-8 recommandé

## Exemples d'Utilisation

### cURL

```bash
# Traitement d'un fichier CSV
curl -X POST http://localhost:8080/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "data.csv",
    "fileType": "csv",
    "data": "name,age,salary\nJohn,25,50000\nJane,30,60000"
  }'

# Vérification du statut
curl http://localhost:8080/api/status/12345

# Téléchargement du fichier traité
curl -O http://localhost:8080/api/download/12345
```

### JavaScript (Fetch)

```javascript
// Traitement de données
const response = await fetch('http://localhost:8080/api/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fileName: 'data.csv',
    fileType: 'csv',
    data: 'name,age,salary\nJohn,25,50000\nJane,30,60000'
  })
});

const result = await response.json();
console.log(result);
```

### Python (requests)

```python
import requests

# Traitement de données
data = {
    "fileName": "data.csv",
    "fileType": "csv",
    "data": "name,age,salary\nJohn,25,50000\nJane,30,60000"
}

response = requests.post(
    'http://localhost:8080/api/process',
    json=data
)

result = response.json()
print(result)
```

## Support

Pour toute question ou problème, veuillez consulter la documentation ou créer une issue sur le repository GitHub.