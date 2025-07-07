import React from 'react';
import { Loader2, FileText, CheckCircle, AlertCircle, BarChart3, Database } from 'lucide-react';

interface ProcessingStatusProps {
  fileName: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ fileName }) => {
  const steps = [
    { id: 1, name: 'Analyse du fichier', icon: FileText, status: 'completed' },
    { id: 2, name: 'Détection valeurs manquantes', icon: AlertCircle, status: 'processing' },
    { id: 3, name: 'Identification outliers', icon: BarChart3, status: 'pending' },
    { id: 4, name: 'Suppression doublons', icon: Database, status: 'pending' },
    { id: 5, name: 'Normalisation', icon: CheckCircle, status: 'pending' }
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4 p-lg-5">
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '64px', height: '64px'}}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <h2 className="h3 fw-bold mb-2">Traitement en cours</h2>
          <p className="text-muted">Fichier: <span className="fw-medium">{fileName}</span></p>
        </div>

        <div className="d-flex flex-column gap-3 mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className={`processing-step card border ${
                step.status === 'completed' 
                  ? 'border-success completed' 
                  : step.status === 'processing'
                  ? 'border-primary processing'
                  : 'border-light'
              }`}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                      step.status === 'completed' 
                        ? 'bg-success text-white' 
                        : step.status === 'processing'
                        ? 'bg-primary text-white'
                        : 'bg-light text-muted'
                    }`} style={{width: '40px', height: '40px'}}>
                      {step.status === 'processing' ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    
                    <div className="flex-grow-1">
                      <h5 className={`mb-1 ${
                        step.status === 'completed' 
                          ? 'text-success' 
                          : step.status === 'processing'
                          ? 'text-primary'
                          : 'text-muted'
                      }`}>
                        {step.name}
                      </h5>
                      <small className="text-muted">
                        {step.status === 'completed' && 'Terminé'}
                        {step.status === 'processing' && 'En cours...'}
                        {step.status === 'pending' && 'En attente'}
                      </small>
                    </div>
                    
                    {step.status === 'completed' && (
                      <CheckCircle size={24} className="text-success" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card bg-primary bg-opacity-10 border-primary border-opacity-25">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-medium text-primary">Progression</span>
              <span className="small text-primary">40%</span>
            </div>
            <div className="progress" style={{height: '8px'}}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{width: '40%'}}
                aria-valuenow={40} 
                aria-valuemin={0} 
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;