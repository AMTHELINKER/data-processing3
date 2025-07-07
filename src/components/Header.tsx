import React, { useState } from 'react';
import { Database, Github, BookOpen } from 'lucide-react';
import DocumentationModal from './DocumentationModal';

const Header: React.FC = () => {
  const [showDoc, setShowDoc] = useState(false);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
              <Database size={24} className="text-white" />
            </div>
            <div>
              <div className="fw-bold text-dark">RAXASS PROJECT</div>
              <small className="text-muted">Data Processing API</small>
            </div>
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto d-flex align-items-center gap-3">
              <a href="#" className="nav-link d-flex align-items-center gap-2 text-muted" onClick={e => {e.preventDefault(); setShowDoc(true);}}>
                <BookOpen size={16} />
                <span>Documentation</span>
              </a>
              <a href="#" className="nav-link d-flex align-items-center gap-2 text-muted">
                <Github size={16} />
                <span>GitHub</span>
              </a>
              <button className="btn btn-primary btn-sm">
                API Key
              </button>
            </div>
          </div>
        </div>
      </nav>
      <DocumentationModal show={showDoc} onClose={() => setShowDoc(false)} />
    </>
  );
};

export default Header;