import React from 'react';
import { Download, RefreshCw, CheckCircle, AlertCircle, BarChart3, FileText, Clock } from 'lucide-react';
import { ProcessingResult } from '../App';

interface ResultsDisplayProps {
  result: ProcessingResult;
  onReset: () => void;
  onCheckStatus: (id: string) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset, onCheckStatus }) => {
  const handleDownload = () => {
    // Simulation du téléchargement
    const link = document.createElement('a');
    link.href = '#';
    link.download = result.processedFile;
    link.click();
  };

  if (result.status === 'error') {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5 text-center">
          <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '64px', height: '64px'}}>
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2 className="h3 fw-bold mb-2">Erreur de traitement</h2>
          <p className="text-muted mb-4">{result.message}</p>
          <button
            onClick={onReset}
            className="btn btn-primary d-inline-flex align-items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  if (!result.statistics) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5 text-center">
          <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '64px', height: '64px'}}>
            <AlertCircle size={32} className="text-danger" />
          </div>
          <h2 className="h3 fw-bold mb-2">Erreur de résultat</h2>
          <p className="text-muted mb-4">Aucune statistique n'a été retournée par le backend. Le format du fichier ou la réponse est invalide.</p>
          <pre className="bg-light text-start p-2 rounded small mb-3" style={{maxHeight: 200, overflowY: 'auto'}}>
            {JSON.stringify(result, null, 2)}
          </pre>
          <button
            onClick={onReset}
            className="btn btn-primary d-inline-flex align-items-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* Success Header */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5 text-center">
          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '64px', height: '64px'}}>
            <CheckCircle size={32} className="text-success" />
          </div>
          <h2 className="h3 fw-bold mb-2">Traitement terminé avec succès</h2>
          <p className="text-muted mb-4">
            Votre fichier a été nettoyé et normalisé en {result.processingTime}s
          </p>
          
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <a
              href={`http://localhost:8080/api/download/${result.originalFile}`}
              className="btn btn-success d-inline-flex align-items-center gap-2"
              download
            >
              <Download size={20} />
              <span>Télécharger le fichier nettoyé</span>
            </a>
            <button
              onClick={() => onCheckStatus(result.originalFile)}
              className="btn btn-info d-inline-flex align-items-center gap-2"
            >
              <BarChart3 size={20} />
              <span>Vérifier le statut</span>
            </button>
            <button
              onClick={onReset}
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
            >
              <RefreshCw size={20} />
              <span>Nouveau fichier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <h3 className="h4 fw-bold mb-4">Statistiques de traitement</h3>
          
          <div className="row g-3 mb-4">
            <div className="col-md-6 col-lg-3">
              <div className="card bg-primary bg-opacity-10 border-primary border-opacity-25 h-100">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <FileText size={24} className="text-primary" />
                    <span className="fw-medium text-primary">Lignes totales</span>
                  </div>
                  <p className="h3 fw-bold text-primary mb-0">{result.statistics.totalRows.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card bg-danger bg-opacity-10 border-danger border-opacity-25 h-100">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <AlertCircle size={24} className="text-danger" />
                    <span className="fw-medium text-danger">Valeurs manquantes</span>
                  </div>
                  <p className="h3 fw-bold text-danger mb-0">{result.statistics.missingValues}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card bg-warning bg-opacity-10 border-warning border-opacity-25 h-100">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <BarChart3 size={24} className="text-warning" />
                    <span className="fw-medium text-warning">Outliers</span>
                  </div>
                  <p className="h3 fw-bold text-warning mb-0">{result.statistics.outliers}</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card bg-info bg-opacity-10 border-info border-opacity-25 h-100">
                <div className="card-body text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                    <FileText size={24} className="text-info" />
                    <span className="fw-medium text-info">Doublons</span>
                  </div>
                  <p className="h3 fw-bold text-info mb-0">{result.statistics.duplicates}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Normalized Columns */}
          <div className="border-top pt-4 mb-4">
            <h4 className="h6 fw-semibold mb-3">Colonnes normalisées</h4>
            <div className="d-flex flex-wrap gap-2">
              {result.statistics.normalizedColumns.map((column, index) => (
                <span
                  key={index}
                  className="badge bg-success badge-custom"
                >
                  {column}
                </span>
              ))}
            </div>
          </div>

          {/* Processing Time */}
          <div className="border-top pt-4">
            <div className="d-flex align-items-center gap-2">
              <Clock size={20} className="text-muted" />
              <span className="text-muted">
                Temps de traitement: <span className="fw-medium">{result.processingTime}s</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* File Information */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <h3 className="h4 fw-bold mb-4">Informations sur les fichiers</h3>
          
          <div className="row g-4">
            <div className="col-md-6">
              <h4 className="h6 fw-medium mb-2">Fichier original</h4>
              <div className="code-block">
                <code>{result.originalFile}</code>
              </div>
            </div>
            
            <div className="col-md-6">
              <h4 className="h6 fw-medium mb-2">Fichier traité</h4>
              <div className="code-block">
                <code>{result.processedFile}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;