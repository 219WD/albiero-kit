// WorkWithUs.jsx
import React from 'react';
import './WorkWithUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const WorkWithUs = () => {
  const handleSendCV = () => {
    window.location.href = 'mailto:rrhh@albiero.com.ar?subject=CV - Postulación Albiero';
  };

  return (
    <section className="work-with-us">
      <div className="work-with-us-container">

        <div className="work-with-us-inner">
          <div className="work-with-us-text">
            <h2 className="work-with-us-title">
              Trabajá con <span className="work-gradient">nosotros</span>
            </h2>
            <p className="work-with-us-description">
              En Albiero creemos en el crecimiento del equipo y en el desarrollo
              profesional. Si querés formar parte de nuestra empresa, podés
              enviarnos tu CV.
            </p>
          </div>

          <div className="work-with-us-cta">
            <a href="mailto:rrhh@albiero.com.ar" className="work-email-link">
              <FontAwesomeIcon icon={faEnvelope} className="work-email-icon" />
              <span>rrhh@albiero.com.ar</span>
            </a>
            <button className="work-cta-button" onClick={handleSendCV}>
              <FontAwesomeIcon icon={faPaperPlane} className="work-btn-icon" />
              <span>Enviar CV</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkWithUs;