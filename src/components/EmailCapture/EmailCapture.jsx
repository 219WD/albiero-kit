import React, { useCallback, useEffect, useState } from "react";
import "./EmailCapture.css";
import "../KitAlarmaCamara/HeroSecurity.css";
import { sendMetaEvent, setMetaAdvancedMatching } from "../../utils/metaEvents";
import cyberBackground from "../../assets/cyber.png";
import useFacebookPixel from "../../hooks/useFacebookPixel";
import useGoogleAnalytics from "../../hooks/useGoogleAnalytics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBuilding,
  faHome,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const PROD_API_BASE = "https://albi-backend-nine.vercel.app";
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || "";
const API_BASE =
  isLocalHost
    ? (configuredApiBase.includes("localhost") ? configuredApiBase : "http://localhost:4000")
    : (configuredApiBase.includes("localhost") ? PROD_API_BASE : configuredApiBase || PROD_API_BASE);

const MODAL_DELAY = 500;
const SISTEMA_LABELS = {
  chico: "Mini",
  mediano: "Básico",
  grande: "Premium",
  personalizado: "Asesoramiento personalizado",
};
const DEFAULT_PROMO = {
  id: "default",
  title: "50% OFF en la instalación",
  subtitle: "Instalá tu kit de alarma y cámaras en comodato con un beneficio exclusivo.",
  badge: "CYBERMONDAY",
  discountValue: "50%",
  discountLabel: "OFF",
  offerText: "Obtené 50% OFF en la instalación de tu kit de alarma y cámaras en comodato.",
  features: [
    "Instalación con 50% OFF",
    "Kit de alarma y cámaras en comodato",
    "Monitoreo profesional para tu casa o negocio",
    "Más de 40 años protegiendo Tucumán",
  ],
  ctaText: "QUIERO MI BENEFICIO AHORA",
  successTitle: "Listo. Tu beneficio ya está activo",
  successText: "Guardamos tus datos para coordinar la instalación con el beneficio correspondiente.",
  imageUrl: "",
  linkUrl: "",
};

function generarCodigo() {
  return "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

async function getActivePromo() {
  const response = await fetch(`${API_BASE}/api/promos/active`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}`);
  }

  return { ...DEFAULT_PROMO, id: data.promo?.id || DEFAULT_PROMO.id };
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

async function enviarEmail({ email, nombre = "", telefono = "", tipo, promoId = "" }) {
  const codigo = tipo === "descuento" ? generarCodigo() : null;

  const subscribeResponse = await fetch(`${API_BASE}/api/emailmkt/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      nombre,
      telefono,
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

async function guardarLeadCompleto(lead) {
  const response = await fetch(`${API_BASE}/api/emailmkt/complete-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Error ${response.status}`);
  }

  return response.json().catch(() => ({ ok: true }));
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizarTelefono(telefono = "") {
  return telefono.replace(/[^\d+]/g, "").trim();
}

function esTelefonoValido(telefono) {
  return normalizarTelefono(telefono).replace(/\D/g, "").length >= 8;
}

function BenefitConfigurator({ leadId, contact, onComplete }) {
  const {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  } = useFacebookPixel();
  const { trackLeadGA4 } = useGoogleAnalytics();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ tipo: "", ubicacion: "", sistema: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const openDiscountWhatsApp = async (selectedData) => {
    const resolvedLeadId = leadId || `ALB-${Date.now().toString(36).toUpperCase()}`;
    const completeData = {
      ...selectedData,
      leadId: resolvedLeadId,
      lead_id: resolvedLeadId,
      codigo: resolvedLeadId,
      nombre: contact.nombre,
      email: contact.email,
      telefono: contact.telefono,
      promocion: "CyberMonday 50% OFF",
      beneficio: "50% OFF en la instalación del kit de alarma y cámaras en comodato",
      eventName: "FormularioEnviado_WhatsApp",
      bienvenidaEnviada: true,
      tipoLabel: selectedData.tipo === "casa" ? "Casa" : "Comercio",
      sistemaLabel: SISTEMA_LABELS[selectedData.sistema] || selectedData.sistema,
    };
    const tipoTexto = completeData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto = SISTEMA_LABELS[completeData.sistema] || completeData.sistema;

    localStorage.setItem("albiero_codigo", resolvedLeadId);
    localStorage.setItem("albiero_nombre", completeData.nombre);
    localStorage.setItem("albiero_email", completeData.email);
    localStorage.setItem("albiero_telefono", completeData.telefono);
    localStorage.setItem("albiero_lead_nombre", completeData.nombre);
    localStorage.setItem("albiero_lead_email", completeData.email);
    localStorage.setItem("albiero_lead_telefono", completeData.telefono);

    const popup = window.open("about:blank", "_blank");

    try {
      await guardarLeadCompleto(completeData);
    } catch (saveError) {
      if (popup) popup.close();
      setSubmitting(false);
      setError("No pudimos guardar tu beneficio. Intenta nuevamente.");
      console.error("[CyberMonday] No se pudo guardar el lead completo", saveError);
      return;
    }

    trackFormComplete(completeData);
    trackLeadGA4(completeData);

    const mensaje = encodeURIComponent(
      `Hola! Quiero usar mi beneficio CyberMonday del 50% OFF en la instalación de mi Kit de Alarma y Cámara en comodato.\n\n` +
      `Mi consulta:\n` +
      `ID de consulta: ${resolvedLeadId}\n` +
      `Nombre: ${completeData.nombre}\n` +
      `Email: ${completeData.email}\n` +
      `WhatsApp: ${completeData.telefono}\n` +
      `Para: ${tipoTexto}\n` +
      `Ubicación: ${completeData.ubicacion}\n` +
      `Sistema: ${sistemaTexto}\n` +
      `Beneficio: 50% OFF en la instalación, con equipos en comodato.`
    );
    const whatsappUrl = `https://wa.me/5493812228265?text=${mensaje}`;

    if (popup) {
      setTimeout(() => { popup.location.href = whatsappUrl; }, 450);
    } else {
      window.location.href = whatsappUrl;
    }

    onComplete();
  };

  const handleOptionSelect = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    setError("");

    if (field === "tipo") {
      trackTipoSelected(value);
    } else if (field === "ubicacion") {
      trackUbicacionSelected(nextData.tipo, value);
    } else if (field === "sistema") {
      trackSistemaSelected(nextData.tipo, nextData.ubicacion, value);
      setSubmitting(true);
      openDiscountWhatsApp(nextData);
      return;
    }

    if (currentStep < 3) {
      setTimeout(() => setCurrentStep((step) => step + 1), 260);
    }
  };

  const stepTitle = currentStep === 1
    ? "Paso 1: ¿Es para?"
    : currentStep === 2
      ? "Paso 2: ¿Dónde querés instalar?"
      : "Paso 3: Elegí tu kit y usá tu beneficio";

  return (
    <div className="ec-configurator security-form">
      <h3 className="form-titulo">Usá tu beneficio en 3 pasos</h3>
      <div className="form-steps-indicator" aria-label="Paso del configurador">
        {[1, 2, 3].map((step) => (
          <span key={step} className={`step-dot ${currentStep >= step ? "active" : ""}`} />
        ))}
      </div>

      <div className="form-step">
        <h4 className="step-titulo">{stepTitle}</h4>

        {currentStep === 1 && (
          <div className="step-opciones">
            <button
              type="button"
              onClick={() => handleOptionSelect("tipo", "casa")}
              className={`opcion-btn opcion-casa ${formData.tipo === "casa" ? "selected" : ""}`}
            >
              <FontAwesomeIcon icon={faHome} className="btn-icon" aria-hidden="true" /> Casa
            </button>
            <button
              type="button"
              onClick={() => handleOptionSelect("tipo", "comercio")}
              className={`opcion-btn ${formData.tipo === "comercio" ? "selected" : ""}`}
            >
              <FontAwesomeIcon icon={faBuilding} className="btn-icon" aria-hidden="true" /> Comercio
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <>
            <div className="step-opciones vertical">
              {["Yerba Buena", "San Miguel de Tucumán", "Tafí Viejo", "Tafí del Valle", "El Mollar", "Otra zona"].map((lugar) => (
                <button
                  type="button"
                  key={lugar}
                  onClick={() => handleOptionSelect("ubicacion", lugar)}
                  className={`opcion-btn ${formData.ubicacion === lugar ? "selected" : ""}`}
                >
                  <FontAwesomeIcon icon={faLocationDot} className="btn-icon" aria-hidden="true" /> {lugar}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setCurrentStep(1)} className="btn-volver">
              <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Volver
            </button>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="step-opciones vertical">
              {[
                { value: "chico", label: "Mini", desc: "(ambientes reducidos)" },
                { value: "mediano", label: "Básico", desc: "(propiedad estándar)" },
                { value: "grande", label: "Premium", desc: "(propiedad amplia)" },
                { value: "personalizado", label: "Necesito asesoramiento personalizado", desc: "" },
              ].map((opcion) => (
                <button
                  type="button"
                  key={opcion.value}
                  onClick={() => handleOptionSelect("sistema", opcion.value)}
                  className={`opcion-btn sistema ${formData.sistema === opcion.value ? "selected" : ""}`}
                  disabled={submitting}
                >
                  <span className="opcion-label">{opcion.label}</span>
                  {opcion.desc && <span className="opcion-desc">{opcion.desc}</span>}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setCurrentStep(2)} className="btn-volver">
              <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Volver
            </button>
          </>
        )}

        {error && <p className="form-error">{error}</p>}
      </div>
    </div>
  );
}

function DiscountModal({ onClose, promo }) {
  const [step, setStep] = useState("form");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
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
    if (!esTelefonoValido(telefono)) {
      setError("Ingresa un número de WhatsApp válido.");
      return;
    }

    const telefonoLimpio = normalizarTelefono(telefono);

    setError("");
    setLoading(true);

    try {
      const res = await enviarEmail({
        email,
        nombre,
        telefono: telefonoLimpio,
        tipo: "descuento",
        promoId: promo.id,
      });
      setCodigo(res.codigo);
      localStorage.setItem("albiero_subscribed", "1");
      localStorage.setItem("albiero_email", email);
      localStorage.setItem("albiero_nombre", nombre);
      localStorage.setItem("albiero_telefono", telefonoLimpio);
      localStorage.setItem("albiero_lead_email", email);
      localStorage.setItem("albiero_lead_nombre", nombre);
      localStorage.setItem("albiero_lead_telefono", telefonoLimpio);
      localStorage.setItem("albiero_codigo", res.codigo);
      localStorage.setItem("albiero_promo_id", promo.id || "default");
      setTelefono(telefonoLimpio);
      setMetaAdvancedMatching({ email, nombre, telefono: telefonoLimpio });
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

        <div
          className="ec-modal__left"
          style={{ "--ec-modal-cyber-bg": `url(${cyberBackground})` }}
        >
          <span className="ec-modal__badge">
            {promo.badge === "BENEFICIO EXCLUSIVO" ? "CYBERMONDAY" : promo.badge}
          </span>
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

        <div className={`ec-modal__right ${step === "config" ? "ec-modal__right--config" : ""}`}>
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
                <div className="ec-field">
                  <label htmlFor="dm-telefono" className="ec-label">
                    WhatsApp / teléfono *
                  </label>
                  <input
                    id="dm-telefono"
                    type="tel"
                    className={`ec-input ${error === "Ingresa un número de WhatsApp válido." ? "ec-input--error" : ""}`}
                    placeholder="381 555 1234"
                    value={telefono}
                    onChange={(e) => {
                      setTelefono(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    autoComplete="tel"
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
          ) : step === "success" ? (
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
              <button
                type="button"
                className="ec-btn ec-btn--primary"
                onClick={() => setStep("config")}
              >
                Usar mi beneficio
              </button>
              <button className="ec-btn ec-btn--ghost" onClick={cerrar}>
                Cerrar
              </button>
            </div>
          ) : step === "config" ? (
            <BenefitConfigurator
              leadId={codigo}
              contact={{ nombre, email, telefono }}
              onComplete={() => setStep("done")}
            />
          ) : (
            <div className="ec-success">
              <div className="ec-success__icon">OK</div>
              <h3 className="ec-success__title">Consulta enviada</h3>
              <p className="ec-success__sub">
                Se abrió WhatsApp con tu beneficio CyberMonday y los datos de tu consulta.
              </p>
              <button type="button" className="ec-btn ec-btn--primary" onClick={cerrar}>
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
