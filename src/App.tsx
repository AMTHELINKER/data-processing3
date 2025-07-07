import React, { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertCircle, BarChart3, Database } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ProcessingStatus from './components/ProcessingStatus';
import ResultsDisplay from './components/ResultsDisplay';
import Header from './components/Header';
import Footer from './components/Footer';

export interface ProcessingResult {
  originalFile: string;
  processedFile: string;
  statistics: {
    totalRows: number;
    missingValues: number;
    outliers: number;
    duplicates: number;
    normalizedColumns: string[];
  };
  processingTime: number;
  status: 'success' | 'error';
  message?: string;
}

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setResult(null);

    try {
      // Appel réel à l'API Scala
      const response = await fetch('http://localhost:8080/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.name.split('.').pop(),
          data: await file.text()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du traitement du fichier');
      }

      const result = await response.json();
      setResult(result);
    } catch (error: any) {
      setResult({
        originalFile: file.name,
        processedFile: '',
        statistics: {
          totalRows: 0,
          missingValues: 0,
          outliers: 0,
          duplicates: 0,
          normalizedColumns: []
        },
        processingTime: 0,
        status: 'error',
        message: error.message || 'Erreur lors du traitement du fichier'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckStatus = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/status/${id}`);
      const status = await response.json();
      alert(`Statut: ${status.status}\nProgression: ${status.progress}%\nÉtape: ${status.currentStep}`);
    } catch (error) {
      alert('Erreur lors de la récupération du statut');
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="hero-section py-5">
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="d-flex justify-content-center mb-4">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                    <Database size={40} className="text-white" />
                  </div>
                </div>
                <h1 className="display-4 fw-bold text-dark mb-4">
                  API de Traitement de Données
                </h1>
                <p className="lead text-muted mb-5">
                  Automatisez le nettoyage et la normalisation de vos données avec notre API Scala. 
                  Traitez les valeurs manquantes, les outliers et les doublons en quelques clics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-5">
          <div className="container">
            <div className="row g-4 mb-5">
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 feature-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-danger bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <AlertCircle size={24} className="text-danger" />
                    </div>
                    <h5 className="card-title fw-semibold">Valeurs Manquantes</h5>
                    <p className="card-text text-muted small">Détection et traitement automatique des valeurs nulles ou vides</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 feature-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-warning bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <BarChart3 size={24} className="text-warning" />
                    </div>
                    <h5 className="card-title fw-semibold">Valeurs Aberrantes</h5>
                    <p className="card-text text-muted small">Identification et correction des outliers statistiques</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 feature-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-info bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <FileText size={24} className="text-info" />
                    </div>
                    <h5 className="card-title fw-semibold">Doublons</h5>
                    <p className="card-text text-muted small">Suppression des enregistrements dupliqués</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-3">
                <div className="card h-100 feature-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="bg-success bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <CheckCircle size={24} className="text-success" />
                    </div>
                    <h5 className="card-title fw-semibold">Normalisation</h5>
                    <p className="card-text text-muted small">Standardisation et normalisation des données numériques</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Processing Area */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {!uploadedFile && !isProcessing && !result && (
                  <FileUpload onFileUpload={handleFileUpload} />
                )}

                {isProcessing && (
                  <ProcessingStatus fileName={uploadedFile?.name || ''} />
                )}

                {result && (
                  <ResultsDisplay result={result} onReset={handleReset} onCheckStatus={handleCheckStatus} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* API Documentation Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h3 fw-bold mb-4">Documentation API</h2>
                
                <div className="row g-4">
                  <div className="col-lg-6">
                    <h3 className="h5 fw-semibold mb-3">Endpoints Disponibles</h3>
                    <div className="d-flex flex-column gap-3">
                      <div className="code-block">
                        <code className="text-primary fw-medium">POST /api/process</code>
                        <p className="text-muted mt-2 mb-0 small">Traite un fichier CSV/JSON/XML</p>
                      </div>
                      <div className="code-block">
                        <code className="text-primary fw-medium">{"GET /api/status/{id}"}</code>
                        <p className="text-muted mt-2 mb-0 small">Vérifie le statut du traitement</p>
                      </div>
                      <div className="code-block">
                        <code className="text-primary fw-medium">{"GET /api/download/{id}"}</code>
                        <p className="text-muted mt-2 mb-0 small">Télécharge le fichier traité</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <h3 className="h5 fw-semibold mb-3">Formats Supportés</h3>
                    <div className="d-flex flex-column gap-2 mb-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{width: '12px', height: '12px'}}></div>
                        <span className="text-muted">CSV (Comma Separated Values)</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{width: '12px', height: '12px'}}></div>
                        <span className="text-muted">JSON (JavaScript Object Notation)</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{width: '12px', height: '12px'}}></div>
                        <span className="text-muted">XML (eXtensible Markup Language)</span>
                      </div>
                    </div>
                    
                    <h4 className="h6 fw-semibold mb-2">Taille Maximum</h4>
                    <p className="text-muted mb-0">100 MB par fichier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;