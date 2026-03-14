// components/NewsletterSection/NewsletterSection.jsx
import React, { useState } from "react";
import "./NewsletterSection.css";

const NewsletterSection = ({ onSubmit, loading, success, error, onResetState }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit({ email, tipo: "newsletter" });
    if (ok) {
      setSubmitted(true);
      setEmail("");
    }
  };

  if (submitted && success) {
    return (
      <section className="nl-section">
        <div className="nl-container nl-success-state">
          <div className="nl-success-icon">✓</div>
          <div>
            <h3 className="nl-success-title">¡Ya estás suscripto!</h3>
            <p className="nl-success-text">
              Te avisaremos de todas las ofertas y novedades de Albiero Seguridad.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="nl-section">
      <div className="nl-container">
        {/* Texto */}
        <div className="nl-text">
          <span className="nl-tag">📧 Newsletter</span>
          <h3 className="nl-title">Ofertas y novedades exclusivas</h3>
          <p className="nl-subtitle">
            Suscribite y recibí alertas de promociones, nuevos equipos y consejos de seguridad.
          </p>
        </div>

        {/* Formulario */}
        <form className="nl-form" onSubmit={handleSubmit}>
          <div className="nl-input-group">
            <input
              type="email"
              className="nl-input"
              placeholder="Ingresá tu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email para newsletter"
            />
            <button type="submit" className="nl-btn" disabled={loading}>
              {loading ? (
                <span className="nl-spinner" aria-hidden="true" />
              ) : (
                "Suscribirme"
              )}
            </button>
          </div>

          {error && <p className="nl-error">{error}</p>}

          <p className="nl-disclaimer">
            Sin spam. Podés darte de baja cuando quieras.
          </p>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;