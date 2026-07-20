import React, { useCallback, useEffect, useState } from "react";
import "./EmailCapture.css";
import { sendMetaEvent, setMetaAdvancedMatching } from "../../utils/metaEvents";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe-4GM8l5t2r7wMki0tspCV7OXoGd75BW9DaKovyBqXm6vHyg/formResponse";
const ENTRY_EMAIL = "entry.150801547";
const ENTRY_NOMBRE = "entry.586312181";
const ENTRY_CODIGO = "entry.1712587123";

const PROD_API_BASE = "https://albi-backend-nine.vercel.app";
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || "";
const API_BASE =
  !isLocalHost && configuredApiBase.includes("localhost")
    ? PROD_API_BASE
    : configuredApiBase || (isLocalHost ? "http://localhost:4000" : PROD_API_BASE);

const MODAL_DELAY = 500;
const DEFAULT_PROMO = {
  id: "default",
  title: "Beneficio exclusivo Albiero",
  subtitle: "Dejanos tu email y recibí novedades, promos y beneficios para proteger tu casa o negocio.",
  badge: "PROMO ALBIERO",
  discountValue: "20%",
  discountLabel: "OFF",
  offerText: "Accedé a beneficios especiales para nuevas instalaciones y asesoramiento personalizado.",
  features: [
    "Promociones activas",
    "Novedades de seguridad",
    "Asesoramiento para tu zona",
    "Beneficios para nuevas instalaciones",
  ],
  ctaText: "QUIERO MI BENEFICIO",
  successTitle: "Listo. Ya estas suscripto",
  successText: "Guardamos tu email para enviarte novedades y beneficios Albiero.",
  imageUrl: "",
  linkUrl: "",
};

function generarCodigo() {
  return "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

function submitToGoogleSheet({ email, nombre = "", codigo = "" }) {
  if (typeof document === "undefined") return;

  const params = new URLSearchParams({
    [ENTRY_EMAIL]: email,
    [ENTRY_NOMBRE]: nombre || "-",
    [ENTRY_CODIGO]: codigo || "-",
    "entry.1390851687": "",
    submit: "Submit",
  });

  const beaconSent =
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(FORM_URL, params);

  if (!beaconSent) {
    fetch(FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: params,
      keepalive: true,
    }).catch(() => {});
  }

  const iframeName = `albiero-email-sheet-${Date.now()}`;
  const iframe = document.createElement("iframe");
  iframe.name = iframeName;
  iframe.style.display = "none";

  const form = document.createElement("form");
  form.method = "POST";
  form.action = FORM_URL;
  form.target = iframeName;
  form.style.display = "none";

  Array.from(params.entries()).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(iframe);
  document.body.appendChild(form);
  form.submit();

  setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 5000);
}

async function getActivePromo() {
  const response = await fetch(`${API_BASE}/api/promos/active`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}`);
  }

  return data.promo || DEFAULT_PROMO;
}

function recordPromoEvent(promoId, type) {
  if (!promoId || promoId === "default") return;

  fetch(`${API_BASE}/api/promos/${encodeURIComponent(promoId)}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ type }),
  }).catch(() => {});
}

async function enviarEmail({ email, nombre = "", tipo, promoId = "" }) {
  const codigo = tipo === "descuento" ? generarCodigo() : null;
  submitToGoogleSheet({ email, nombre, codigo });

  const subscribeResponse = await fetch(`${API_BASE}/api/emailmkt/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      nombre,
      codigo,
      promoId,
      source: "email_capture",
      bienvenidaEnviada: true,
    }),
  });

  if (!subscribeResponse.ok) {
    const data = await subscribeResponse.json().catch(() => ({}));
    throw new Error(data.error || `Error ${subscribeResponse.status}`);
  }

  return { ok: true, codigo };
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function DiscountModal({ onClose, promo }) {
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
      setError("Ingresa tu nombre.");
      return;
    }
    if (!esEmailValido(email)) {
      setError("Ingresa un email valido.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await enviarEmail({ email, nombre, tipo: "descuento", promoId: promo.id });
      setCodigo(res.codigo);
      localStorage.setItem("albiero_subscribed", "1");
      localStorage.setItem("albiero_email", email);
      localStorage.setItem("albiero_nombre", nombre);
      localStorage.setItem("albiero_codigo", res.codigo);
      localStorage.setItem("albiero_promo_id", promo.id || "default");
      setMetaAdvancedMatching({ email, nombre });
      sendMetaEvent("trackCustom", "Promo_Suscripcion", {
        content_name: promo.title,
        promo_id: promo.id,
      }, { warnPrefix: "Pixel Promo" });
      recordPromoEvent(promo.id, "subscribe");
      setStep("success");
    } catch {
      setError("Error al conectar. Intenta de nuevo.");
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
    <div className={`ec-overlay ${visible ? "ec-overlay--in" : ""}`} onClick={cerrar}>
      <div
        className={`ec-modal ${visible ? "ec-modal--in" : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Oferta de descuento"
      >
        <button className="ec-modal__close" onClick={cerrar} aria-label="Cerrar">
          x
        </button>

        <div className="ec-modal__left">
          <span className="ec-modal__badge">{promo.badge}</span>
          <div className="ec-modal__circle">
            <span className="ec-modal__percent">{promo.discountValue}</span>
            <span className="ec-modal__off">{promo.discountLabel}</span>
          </div>
          <p className="ec-modal__offer-text">{promo.offerText}</p>
          {promo.imageUrl && (
            <div className="ec-modal__prize" aria-label="Premio: 2 camaras Cygnus A1">
              {[1, 2].map((item) => (
                <img
                  className={`ec-modal__product ec-modal__product--${item}`}
                  src={promo.imageUrl}
                  alt="Camara Cygnus A1"
                  key={item}
                />
              ))}
            </div>
          )}
          <ul className="ec-modal__features">
            {(promo.features || []).map((feature) => (
              <li key={feature}>- {feature}</li>
            ))}
          </ul>
        </div>

        <div className="ec-modal__right">
          {step === "form" ? (
            <>
              <h2 className="ec-modal__title">{promo.title}</h2>
              <p className="ec-modal__subtitle">{promo.subtitle}</p>
              <form className="ec-modal__form" onSubmit={handleSubmit} noValidate>
                <div className="ec-field">
                  <label htmlFor="dm-nombre" className="ec-label">
                    Nombre *
                  </label>
                  <input
                    id="dm-nombre"
                    type="text"
                    className={`ec-input ${error === "Ingresa tu nombre." ? "ec-input--error" : ""}`}
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
                    className={`ec-input ${error === "Ingresa un email valido." ? "ec-input--error" : ""}`}
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
                <button type="submit" className="ec-btn ec-btn--primary" disabled={loading}>
                  {loading ? <span className="ec-spinner" /> : `${promo.ctaText} ->`}
                </button>
                <p className="ec-disclaimer">
                  Tus datos estan protegidos. Solo te contactaremos por tu consulta.
                </p>
              </form>
            </>
          ) : (
            <div className="ec-success">
              <div className="ec-success__icon">OK</div>
              <h3 className="ec-success__title">{promo.successTitle}</h3>
              <p className="ec-success__sub">{promo.successText}</p>
              <div className="ec-code-box">
                <span className="ec-code">{codigo}</span>
                <button className="ec-copy-btn" onClick={copiar}>
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="ec-success__note">
                Este beneficio es personal y valido para nuevas instalaciones.
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

function NewsletterBar({ onOpenModal, promo }) {
  return (
    <div className="nl-bar">
      <div className="nl-bar__text">
        <span className="nl-bar__tag">{promo.badge}</span>
        <h3 className="nl-bar__title">{promo.title}</h3>
        <p className="nl-bar__subtitle">{promo.subtitle}</p>
      </div>
      <div className="nl-bar__actions">
        <button className="nl-bar__main-btn" onClick={onOpenModal}>
          {promo.ctaText}
        </button>
        <p className="nl-bar__disclaimer">Podes darte de baja cuando quieras.</p>
      </div>
    </div>
  );
}

export default function EmailCapture() {
  const [modalOpen, setModalOpen] = useState(false);
  const [promo, setPromo] = useState(DEFAULT_PROMO);

  useEffect(() => {
    let cancelled = false;

    getActivePromo()
      .then((activePromo) => {
        if (!cancelled) setPromo(activePromo);
      })
      .catch(() => {
        if (!cancelled) setPromo(DEFAULT_PROMO);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalOpen(true);
    }, MODAL_DELAY);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;

    sendMetaEvent("trackCustom", "Promo_View", {
      content_name: promo.title,
      promo_id: promo.id,
    }, { warnPrefix: "Pixel Promo" });
    recordPromoEvent(promo.id, "view");
  }, [modalOpen, promo.id, promo.title]);

  const abrirModal = useCallback(() => {
    sendMetaEvent("trackCustom", "Promo_Click", {
      content_name: promo.title,
      promo_id: promo.id,
    }, { warnPrefix: "Pixel Promo" });
    recordPromoEvent(promo.id, "click");
    setModalOpen(true);
  }, [promo.id, promo.title]);
  const cerrarModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      {modalOpen && <DiscountModal onClose={cerrarModal} promo={promo} />}
      <NewsletterBar onOpenModal={abrirModal} promo={promo} />
    </>
  );
}
