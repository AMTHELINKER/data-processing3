import React, { useState } from 'react';
import DocumentationModal from './DocumentationModal';

const Footer: React.FC = () => {
  const [showDoc, setShowDoc] = useState(false);
  return (
    <>
      <footer className="bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <h3 className="h4 fw-bold mb-3">RAXASS PROJECT</h3>
              <p className="text-light mb-3">
                API de traitement de données automatisé développée avec Scala. 
                Simplifiez le nettoyage et la normalisation de vos datasets.
              </p>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <h4 className="h6 fw-semibold mb-3">Ressources</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="footer-link" onClick={e => {e.preventDefault(); setShowDoc(true);}}>Documentation</a></li>
                <li className="mb-2"><a href="#" className="footer-link">Exemples</a></li>
                <li className="mb-2"><a href="#" className="footer-link">Tutoriels</a></li>
                <li className="mb-2"><a href="#" className="footer-link">FAQ</a></li>
              </ul>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <h4 className="h6 fw-semibold mb-3">Support</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="footer-link">Contact</a></li>
                <li className="mb-2"><a href="#" className="footer-link">Communauté</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-top border-secondary mt-4 pt-4 text-center">
            <p className="text-light mb-0">&copy; 2025 Scala DIC2. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      <DocumentationModal show={showDoc} onClose={() => setShowDoc(false)} />
    </>
  );
};

export default Footer;