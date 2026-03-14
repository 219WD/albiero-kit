// components/EmailCapture/EmailCapture.jsx
//
// ¿Cómo usarlo? Simplemente importalo y ponelo ANTES del <footer> en Footer.jsx:
//
//   import EmailCapture from "./EmailCapture/EmailCapture";
//
//   const Footer = () => (
//     <>
//       <EmailCapture />       ← acá, una sola línea
//       <footer className="footer">
//         ...
//       </footer>
//     </>
//   );
//
// ================================================================

import React, { useState, useEffect, useCallback } from "react";
import "./EmailCapture.css";

// ── ⚠️  PEGÁ AQUÍ LA URL DE TU GOOGLE APPS SCRIPT DEPLOYMENT ──
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/REEMPLAZAR_CON_TU_URL/exec";
// ──────────────────────────────────────────────────────────────

const MODAL_DELAY = 9000; // milisegundos hasta que aparece el modal (9s)

// ─── Función que llama al Google Apps Script ──────────────────
// Usamos fetch con mode: "no-cors" + FormData.
// Con no-cors el browser no puede leer la respuesta (opaque response)
// pero el POST SÍ llega al servidor y el email SE GUARDA en el Sheet.
// El código de descuento lo generamos localmente.
async function enviarEmail({ email, nombre = "", tipo }) {
  // En desarrollo local solo simulamos (Google bloquea iframes/frames desde localhost)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log("📧 [DEV] Simulando envío:", { email, nombre, tipo });
    await new Promise(r => setTimeout(r, 700));
    return {
      ok: true,
      codigo: tipo === "descuento"
        ? "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase()
        : null,
    };
  }

  // En producción: enviamos con FormData + no-cors
  // El Apps Script recibe los datos via e.parameter (form fields)
  const formData = new FormData();
  formData.append("email", email);
  formData.append("nombre", nombre || "");
  formData.append("tipo", tipo);

  // no-cors: el fetch no lanza error aunque Google redirija,
  // y el script igual procesa el POST
  await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });

  return {
    ok: true,
    codigo: tipo === "descuento"
      ? "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase()
      : null,
  };
}

// ─── Validador de email ───────────────────────────────────────
function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── MODAL DE DESCUENTO ───────────────────────────────────────
function DiscountModal({ onClose }) {
  const [step, setStep] = useState("form"); // "form" | "success"
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para que la animación de entrada sea suave
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const cerrar = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <button className="ec-modal__close" onClick={cerrar} aria-label="Cerrar">
          ✕
        </button>

        {/* Panel izquierdo */}
        <div className="ec-modal__left">
          <span className="ec-modal__badge">OFERTA EXCLUSIVA</span>
          <div className="ec-modal__circle">
            <span className="ec-modal__percent">10%</span>
            <span className="ec-modal__off">OFF</span>
          </div>
          <p className="ec-modal__offer-text">
            en tu primera instalación de alarma o sistema de cámaras
          </p>
          <ul className="ec-modal__features">
            <li>✓ Sin costo de visita técnica</li>
            <li>✓ Garantía 12 meses</li>
            <li>✓ +40 años de experiencia</li>
          </ul>
        </div>

        {/* Panel derecho */}
        <div className="ec-modal__right">
          {step === "form" ? (
            <>
              <h2 className="ec-modal__title">¡Obtené tu descuento!</h2>
              <p className="ec-modal__subtitle">
                Dejanos tu email y te enviamos el código al instante.
              </p>
              <form className="ec-modal__form" onSubmit={handleSubmit} noValidate>
                <div className="ec-field">
                  <label htmlFor="dm-nombre" className="ec-label">
                    Nombre <span className="ec-optional">(opcional)</span>
                  </label>
                  <input
                    id="dm-nombre"
                    type="text"
                    className="ec-input"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="ec-field">
                  <label htmlFor="dm-email" className="ec-label">
                    Email *
                  </label>
                  <input
                    id="dm-email"
                    type="email"
                    className={`ec-input ${error ? "ec-input--error" : ""}`}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    autoComplete="email"
                  />
                  {error && <span className="ec-error-msg">{error}</span>}
                </div>
                <button
                  type="submit"
                  className="ec-btn ec-btn--primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="ec-spinner" />
                  ) : (
                    "QUIERO MI DESCUENTO →"
                  )}
                </button>
                <p className="ec-disclaimer">
                  Sin spam. Podés darte de baja cuando quieras.
                </p>
              </form>
            </>
          ) : (
            <div className="ec-success">
              <div className="ec-success__icon">🎉</div>
              <h3 className="ec-success__title">¡Tu código está listo!</h3>
              <p className="ec-success__sub">
                Usá este código en tu próxima consulta:
              </p>
              <div className="ec-code-box">
                <span className="ec-code">{codigo}</span>
                <button className="ec-copy-btn" onClick={copiar}>
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="ec-success__note">
                Guardalo o mostráselo a nuestro equipo al momento de la
                instalación.
              </p>
              <button
                className="ec-btn ec-btn--ghost"
                onClick={cerrar}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SECCIÓN NEWSLETTER ───────────────────────────────────────
function NewsletterBar({ onOpenModal }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("idle"); // "idle" | "loading" | "done" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!esEmailValido(email)) {
      setStep("error");
      setErrorMsg("Ingresá un email válido.");
      return;
    }
    setStep("loading");
    try {
      await enviarEmail({ email, tipo: "newsletter" });
      localStorage.setItem("albiero_subscribed", "1");
      setStep("done");
    } catch {
      setStep("error");
      setErrorMsg("Error al conectar. Intentá de nuevo.");
    }
  };

  if (step === "done") {
    return (
      <div className="nl-bar nl-bar--success">
        <div className="nl-success-check">✓</div>
        <div>
          <strong className="nl-success-title">¡Ya estás suscripto!</strong>
          <p className="nl-success-text">
            Te avisaremos de todas las ofertas y novedades.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nl-bar">
      {/* Texto */}
      <div className="nl-bar__text">
        <span className="nl-bar__tag">📧 Newsletter</span>
        <h3 className="nl-bar__title">Ofertas y novedades exclusivas</h3>
        <p className="nl-bar__subtitle">
          Suscribite y recibí promociones, nuevos equipos y consejos de seguridad.
        </p>
      </div>

      {/* Formulario + botón descuento */}
      <div className="nl-bar__actions">
        <form
          className="nl-bar__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="nl-bar__input-row">
            <input
              type="email"
              className="nl-bar__input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (step === "error") setStep("idle");
              }}
              required
              aria-label="Email para newsletter"
            />
            <button
              type="submit"
              className="nl-bar__btn"
              disabled={step === "loading"}
            >
              {step === "loading" ? (
                <span className="ec-spinner ec-spinner--sm" />
              ) : (
                "Suscribirme"
              )}
            </button>
          </div>
          {step === "error" && (
            <span className="ec-error-msg ec-error-msg--nl">{errorMsg}</span>
          )}
          <p className="nl-bar__disclaimer">Sin spam. Baja cuando quieras.</p>
        </form>

        {/* Botón para abrir el modal de descuento */}
        <button className="nl-bar__discount-btn" onClick={onOpenModal}>
          🎁 Obtené 10% OFF en tu primera instalación
        </button>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────
export default function EmailCapture() {
  const [modalOpen, setModalOpen] = useState(false);

  // Mostrar el modal automáticamente tras MODAL_DELAY ms
  useEffect(() => {
    // No mostrar si ya se suscribió o si ya vio el modal en esta sesión
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