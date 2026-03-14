// components/DiscountModal/DiscountModal.jsx
import React, { useState, useEffect } from "react";
import "./DiscountModal.css";

const DiscountModal = ({ isOpen, onClose, onSubmit, loading, success, error }) => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para que la animación de entrada sea visible
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, nombre, tipo: "descuento" });
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`dm-overlay ${visible ? "dm-overlay--visible" : ""}`} onClick={handleClose}>
      <div
        className={`dm-modal ${visible ? "dm-modal--visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-title"
      >
        {/* Botón cerrar */}
        <button className="dm-close" onClick={handleClose} aria-label="Cerrar modal">
          ✕
        </button>

        {/* Lado izquierdo - Imagen/Oferta */}
        <div className="dm-left">
          <div className="dm-badge">OFERTA EXCLUSIVA</div>
          <div className="dm-discount-circle">
            <span className="dm-percent">10%</span>
            <span className="dm-off">OFF</span>
          </div>
          <p className="dm-left-text">en tu primera instalación de alarma o sistema de cámaras</p>
          <div className="dm-features">
            <div className="dm-feature">✓ Sin costo de visita técnica</div>
            <div className="dm-feature">✓ Garantía 12 meses</div>
            <div className="dm-feature">✓ +40 años de experiencia</div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="dm-right">
          {!success ? (
            <>
              <h2 className="dm-title" id="dm-title">
                ¡Obtené tu descuento!
              </h2>
              <p className="dm-subtitle">
                Dejanos tu email y te enviamos el código al instante.
              </p>

              <form className="dm-form" onSubmit={handleSubmit}>
                <div className="dm-field">
                  <label htmlFor="dm-nombre" className="dm-label">Nombre (opcional)</label>
                  <input
                    id="dm-nombre"
                    type="text"
                    className="dm-input"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="dm-field">
                  <label htmlFor="dm-email" className="dm-label">Email *</label>
                  <input
                    id="dm-email"
                    type="email"
                    className="dm-input"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="dm-error">{error}</p>}

                <button
                  type="submit"
                  className="dm-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="dm-btn-loading">
                      <span className="dm-spinner" />
                      Procesando...
                    </span>
                  ) : (
                    "QUIERO MI DESCUENTO →"
                  )}
                </button>

                <p className="dm-disclaimer">
                  Sin spam. Podés darte de baja cuando quieras.
                </p>
              </form>
            </>
          ) : (
            <div className="dm-success">
              <div className="dm-success-icon">🎉</div>
              <h3 className="dm-success-title">¡Tu código está listo!</h3>
              {success.codigo && (
                <>
                  <p className="dm-success-subtitle">Usá este código en tu próxima consulta:</p>
                  <div className="dm-code-box">
                    <span className="dm-code">{success.codigo}</span>
                    <button
                      className="dm-copy-btn"
                      onClick={() => navigator.clipboard.writeText(success.codigo)}
                    >
                      Copiar
                    </button>
                  </div>
                </>
              )}
              <p className="dm-success-note">
                También te enviamos el código a <strong>{email}</strong>
              </p>
              <button className="dm-btn dm-btn--secondary" onClick={handleClose}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;