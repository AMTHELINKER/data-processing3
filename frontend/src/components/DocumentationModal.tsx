import React from 'react';

const DocumentationModal: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Documentation de l'API</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <h6 className="fw-bold">Base URL</h6>
            <code>http://localhost:8080/api</code>
            <hr />
            <h6 className="fw-bold">Endpoints principaux</h6>
            <ul>
              <li><b>POST /process</b> : Traite un fichier de données (CSV, JSON, XML) et retourne les statistiques de nettoyage.</li>
              <li><b>GET /status/&lt;id&gt;</b> : Récupère le statut d'un traitement en cours ou terminé.</li>
              <li><b>GET /download/&lt;id&gt;</b> : Télécharge le fichier traité.</li>
              <li><b>GET /health</b> : Vérifie que l'API est opérationnelle.</li>
            </ul>
            <hr />
            <h6 className="fw-bold">Exemple d'appel (cURL)</h6>
            <pre className="bg-light p-2 rounded small mb-2">
{`curl -X POST http://localhost:8080/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "data.csv",
    "fileType": "csv",
    "data": "name,age,salary\nJohn,25,50000\nJane,30,60000"
  }'
`}
            </pre>
            <h6 className="fw-bold">Formats supportés</h6>
            <ul>
              <li>CSV (Comma Separated Values)</li>
              <li>JSON (JavaScript Object Notation)</li>
              <li>XML (eXtensible Markup Language)</li>
            </ul>
            <h6 className="fw-bold">Limites</h6>
            <ul>
              <li>Taille maximale : 100MB</li>
              <li>Timeout : 60 secondes par requête</li>
              <li>Encodage recommandé : UTF-8</li>
            </ul>
            <h6 className="fw-bold">Réponse type</h6>
            <pre className="bg-light p-2 rounded small mb-2">
{`{
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
}`}
            </pre>
            <h6 className="fw-bold">Statut de traitement</h6>
            <pre className="bg-light p-2 rounded small mb-2">
{`{
  "id": "12345",
  "status": "processing|completed|error",
  "progress": 75,
  "currentStep": "Détection des outliers"
}`}
            </pre>
            <h6 className="fw-bold">Téléchargement</h6>
            <p>Pour télécharger le fichier traité, utilisez l'endpoint <code>GET /download/&lt;id&gt;</code>.</p>
            <h6 className="fw-bold">Sécurité</h6>
            <ul>
              <li>Validation des types de fichiers</li>
              <li>Limitation de taille (100MB max)</li>
              <li>Sanitisation des données d'entrée</li>
              <li>Gestion des erreurs robuste</li>
            </ul>
            <h6 className="fw-bold">Contact & Support</h6>
            <p>Pour toute question, consultez la documentation ou contactez l'équipe via le dépôt GitHub.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal; 