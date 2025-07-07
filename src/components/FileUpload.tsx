import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['text/csv', 'application/json', 'text/xml', 'application/xml'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|json|xml)$/i)) {
      setError('Format de fichier non supporté. Utilisez CSV, JSON ou XML.');
      return false;
    }

    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Taille maximum: 100MB.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4 p-lg-5">
        <div className="text-center mb-4">
          <h2 className="h3 fw-bold mb-2">Télécharger votre fichier</h2>
          <p className="text-muted">Glissez-déposez votre fichier ou cliquez pour sélectionner</p>
        </div>

        <div
          className={`upload-zone rounded-3 p-5 text-center position-relative ${
            dragActive ? 'drag-active' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv,.json,.xml"
            onChange={handleFileInput}
            className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
            style={{ cursor: 'pointer' }}
          />
          
          <div className="d-flex flex-column align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '64px', height: '64px'}}>
              <Upload size={32} className="text-primary" />
            </div>
            
            <div>
              <p className="h5 fw-medium mb-2">
                Glissez votre fichier ici
              </p>
              <p className="text-muted mb-3">
                ou <span className="text-primary fw-medium">cliquez pour parcourir</span>
              </p>
            </div>
            
            <div className="d-flex align-items-center gap-4 text-muted small">
              <div className="d-flex align-items-center gap-2">
                <FileText size={16} />
                <span>CSV</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FileText size={16} />
                <span>JSON</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FileText size={16} />
                <span>XML</span>
              </div>
            </div>
            
            <p className="text-muted small mb-0">Taille maximum: 100MB</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center mt-3" role="alert">
            <AlertCircle size={20} className="me-2 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;