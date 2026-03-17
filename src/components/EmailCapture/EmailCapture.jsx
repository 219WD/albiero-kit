import React, { useState, useEffect, useCallback } from "react";
import "./EmailCapture.css";

// ─── Google Forms ─────────────────────────────────────────────
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe-4GM8l5t2r7wMki0tspCV7OXoGd75BW9DaKovyBqXm6vHyg/formResponse";
const ENTRY_EMAIL = "entry.150801547";
const ENTRY_NOMBRE = "entry.586312181";
const ENTRY_CODIGO = "entry.1712587123"; // ← nuevo campo código

const MODAL_DELAY = 500;

function generarCodigo() {
  return "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

async function enviarEmail({ email, nombre = "", tipo }) {
  // Generamos el código acá para poder enviarlo al form
  const codigo = tipo === "descuento" ? generarCodigo() : null;

  const url = `${FORM_URL}?${ENTRY_EMAIL}=${encodeURIComponent(email)}&${ENTRY_NOMBRE}=${encodeURIComponent(nombre || "-")}&${ENTRY_CODIGO}=${encodeURIComponent(codigo || "-")}&entry.1390851687=&submit=Submit`;


  await fetch(url, { method: "POST", mode: "no-cors" });

  return { ok: true, codigo };
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── MODAL DE DESCUENTO ───────────────────────────────────────
function DiscountModal({ onClose }) {
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const cerrar = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("Ingresá tu nombre.");
      return;
    }
    if (!esEmailValido(email)) {
      setError("Ingresá un email válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await enviarEmail({ email, nombre, tipo: "descuento" });
      setCodigo(res.codigo);
      localStorage.setItem("albiero_subscribed", "1");
      // Guardar en localStorage para cruzar con otros formularios
      localStorage.setItem("albiero_email", email);
      localStorage.setItem("albiero_nombre", nombre);
      localStorage.setItem("albiero_codigo", res.codigo); // ← AGREGAR
      setStep("success");
    } catch {
      setError("Error al conectar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copiar = () => {
    navigator.clipboard.writeText(codigo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={`ec-overlay ${visible ? "ec-overlay--in" : ""}`}
      onClick={cerrar}
    >
      <div
        className={`ec-modal ${visible ? "ec-modal--in" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Oferta de descuento"
      >
        <button
          className="ec-modal__close"
          onClick={cerrar}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="ec-modal__left">
          <span className="ec-modal__badge">BENEFICIO EXCLUSIVO</span>
          <div className="ec-modal__circle">
            <span className="ec-modal__percent">10%</span>
            <span className="ec-modal__off">OFF</span>
          </div>
          <p className="ec-modal__offer-text">
            Aprovechá este beneficio en la instalación de tu sistema de
            seguridad.
          </p>
          <ul className="ec-modal__features">
            <li>✓ Instalación profesional sin costo</li>
            <li>✓ Equipos confiables y garantía oficial</li>
            <li>✓ Más de 40 años protegiendo Tucumán</li>
          </ul>
        </div>

        <div className="ec-modal__right">
          {step === "form" ? (
            <>
              <h2 className="ec-modal__title">¡Accedé a tu beneficio ahora!</h2>
              <p className="ec-modal__subtitle">
                Completá tus datos y recibí tu código exclusivo para la
                instalación.
              </p>
              <form
                className="ec-modal__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="ec-field">
                  <label htmlFor="dm-nombre" className="ec-label">
                    Nombre *
                  </label>
                  <input
                    id="dm-nombre"
                    type="text"
                    className={`ec-input ${error === "Ingresá tu nombre." ? "ec-input--error" : ""}`}
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (error) setError("");
                    }}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="ec-field">
                  <label htmlFor="dm-email" className="ec-label">
                    Email *
                  </label>
                  <input
                    id="dm-email"
                    type="email"
                    className={`ec-input ${error === "Ingresá un email válido." ? "ec-input--error" : ""}`}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    autoComplete="email"
                  />
                </div>
                {error && <span className="ec-error-msg">{error}</span>}
                <button
                  type="submit"
                  className="ec-btn ec-btn--primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="ec-spinner" />
                  ) : (
                    "QUIERO MI BENEFICIO AHORA →"
                  )}
                </button>
                <p className="ec-disclaimer">
                  Tus datos están protegidos. Solo te contactaremos por tu
                  consulta.
                </p>
              </form>
            </>
          ) : (
            <div className="ec-success">
              <div className="ec-success__icon">🎉</div>
              <h3 className="ec-success__title">
                ¡Listo. Tu beneficio ya está activo!
              </h3>
              <p className="ec-success__sub">
                Guardá este código y utilizalo al momento de coordinar la
                instalación.
              </p>
              <div className="ec-code-box">
                <span className="ec-code">{codigo}</span>
                <button className="ec-copy-btn" onClick={copiar}>
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="ec-success__note">
                Este beneficio es personal y válido para nuevas instalaciones.
              </p>
              <button className="ec-btn ec-btn--ghost" onClick={cerrar}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NEWSLETTER BAR ───────────────────────────────────────────
function NewsletterBar({ onOpenModal }) {
  return (
    <div className="nl-bar">
      <div className="nl-bar__text">
        <span className="nl-bar__tag">
          📧 Beneficios y novedades de seguridad
        </span>
        <h3 className="nl-bar__title">
          Accedé a promociones y consejos para proteger tu propiedad
        </h3>
        <p className="nl-bar__subtitle">
          Recibí información sobre sistemas de seguridad, nuevos equipos y
          beneficios exclusivos.
        </p>
      </div>
      <div className="nl-bar__actions">
        <button className="nl-bar__main-btn" onClick={onOpenModal}>
          🎁 Solicitar beneficio ahora
        </button>
        <p className="nl-bar__disclaimer">
          Podés darte de baja cuando quieras.
        </p>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────
export default function EmailCapture() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const yaSuscripto = localStorage.getItem("albiero_subscribed");
    const yaVioModal = sessionStorage.getItem("albiero_modal_shown");
    if (yaSuscripto || yaVioModal) return;

    const timer = setTimeout(() => {
      setModalOpen(true);
      sessionStorage.setItem("albiero_modal_shown", "1");
    }, MODAL_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const abrirModal = useCallback(() => setModalOpen(true), []);
  const cerrarModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      {modalOpen && <DiscountModal onClose={cerrarModal} />}
      <NewsletterBar onOpenModal={abrirModal} />
    </>
  );
}
