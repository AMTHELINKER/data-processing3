# API de Traitement de Données - Sacala DIC2

Une API complète développée en Scala pour automatiser le processus de nettoyage et de normalisation des données.

## 🎯 Objectifs

L'API automatise les tâches suivantes de Data Processing :
- ✅ Vérification et traitement des valeurs manquantes
- ✅ Détection et traitement des valeurs aberrantes (outliers)
- ✅ Suppression des doublons
- ✅ Normalisation des données numériques

## 🏗️ Architecture

### Backend (Scala)
- **Framework**: Akka HTTP
- **Parsing**: Scala CSV, Spray JSON, Scala XML
- **Statistiques**: Apache Commons Math
- **Build Tool**: SBT

### Frontend (React + TypeScript)
- **Framework**: React 18 avec TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🚀 Installation et Démarrage

### Prérequis
- Java 11+
- Scala 2.13+
- SBT 1.9+
- Node.js 18+

### Backend Scala

```bash
# Aller dans le dossier backend
cd scala-backend

# Compiler le projet
sbt compile

# Lancer l'API
sbt run
```

L'API sera disponible sur `http://localhost:8080`

### Frontend React

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'interface sera disponible sur `http://localhost:5173`

## 📡 API Endpoints

### POST /api/process
Traite un fichier de données

**Request Body:**
```json
{
  "fileName": "data.csv",
  "fileType": "csv",
  "data": "name,age,salary\nJohn,25,50000\nJane,30,60000"
}
```

**Response:**
```json
{
  "originalFile": "data.csv",
  "processedFile": "cleaned_data.csv",
  "statistics": {
    "totalRows": 1250,
    "missingValues": 45,
    "outliers": 12,
    "duplicates": 8,
    "normalizedColumns": ["age", "salary"]
  },
  "processingTime": 2.8,
  "status": "success"
}
```

### GET /api/status/{id}
Vérifie le statut du traitement

### GET /api/download/{id}
Télécharge le fichier traité

## 📊 Formats Supportés

- **CSV** (Comma Separated Values)
- **JSON** (JavaScript Object Notation)
- **XML** (eXtensible Markup Language)

## 🔧 Algorithmes de Nettoyage

### Valeurs Manquantes
- **Numériques**: Remplacement par la moyenne
- **Textuelles**: Remplacement par la valeur la plus fréquente

### Outliers
- **Méthode**: IQR (Interquartile Range)
- **Seuil**: 1.5 × IQR
- **Traitement**: Remplacement par la médiane

### Normalisation
- **Méthode**: Min-Max Scaling
- **Formule**: (x - min) / (max - min)
- **Résultat**: Valeurs entre 0 et 1

## 🧪 Tests

```bash
# Backend
cd scala-backend
sbt test

# Frontend
npm test
```

## 📁 Structure du Projet

```
├── scala-backend/
│   ├── src/main/scala/com/sacala/dataprocessing/
│   │   ├── Main.scala
│   │   ├── models/
│   │   ├── services/
│   │   └── routes/
│   ├── src/main/resources/
│   └── build.sbt
├── src/
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## 🔒 Sécurité

- Validation des types de fichiers
- Limitation de taille (100MB max)
- Sanitisation des données d'entrée
- Gestion des erreurs robuste

## 📈 Performance

- Traitement en streaming pour les gros fichiers
- Algorithmes optimisés O(n log n)
- Gestion mémoire efficace
- Cache des résultats

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé dans le cadre du projet Sacala DIC2 pour l'automatisation du traitement de données.