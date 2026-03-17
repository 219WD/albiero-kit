import { useState } from "react";
import useSecurityHeroGsap from "../../hooks/useSecurityHeroGsap.js";
import "./HerosecurityIncendio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBuilding,
  faLocationDot,
  faArrowLeft,
  faFireFlameCurved,
  faBell,
  faClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import useFacebookPixelIncendio from "../../hooks/useFacebookPixelIncendio.js";
import useGoogleAnalyticsIncendio from "../../hooks/useGoogleAnalyticsIncendio.js";

const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";
const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe-4GM8l5t2r7wMki0tspCV7OXoGd75BW9DaKovyBqXm6vHyg/formResponse";

const HerosecurityIncendio = () => {
  useSecurityHeroGsap();

  const {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  } = useFacebookPixelIncendio();

  const {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4,
  } = useGoogleAnalyticsIncendio();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo:      "",
    ubicacion: "",
    sistema:   "",
  });

  const handleOptionSelect = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    if (field === "tipo") {
      trackTipoSelected(value);
      trackTipoSelectedGA4(value);
    } else if (field === "ubicacion") {
      trackUbicacionSelected(newData.tipo, value);
      trackUbicacionSelectedGA4(newData.tipo, value);
    } else if (field === "sistema") {
      trackSistemaSelected(newData.tipo, newData.ubicacion, value);
      trackSistemaSelectedGA4(newData.tipo, newData.ubicacion, value);
    }

    if (currentStep < 3) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = () => {
    trackFormComplete(formData);
    trackLeadGA4(formData);

    // ── Envío silencioso a Google Sheets ────────────────────────────────────
    const email  = localStorage.getItem("albiero_email")  || "-";
    const nombre = localStorage.getItem("albiero_nombre") || "-";
    const codigo =
      localStorage.getItem("albiero_codigo") ||
      "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase();

    const params = new URLSearchParams({
      "entry.150801547":  email,
      "entry.586312181":  nombre,
      "entry.1712587123": codigo,
      "entry.918807836":  formData.tipo,
      "entry.101350454":  formData.ubicacion,
      "entry.865536607":  formData.sistema,
      "entry.633861612":  "Incendio",
      "entry.1390851687": localStorage.getItem("albiero_subscribed") ? "Si" : "",
      submit: "Submit",
    });

    fetch(`${FORM_URL}?${params.toString()}`, {
      method: "POST",
      mode:   "no-cors",
    });
    // ── Fin envío Sheet ──────────────────────────────────────────────────────

    const tipoTexto    = formData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto =
      {
        chico:         "Kit Chico (espacios reducidos)",
        mediano:       "Kit Mediano (propiedad estándar)",
        grande:        "Kit Grande (propiedad amplia)",
        personalizado: "Asesoramiento personalizado",
      }[formData.sistema] || formData.sistema;

    const mensaje = `Hola! Quiero asesoramiento por el sistema de detección de incendios.%0A%0A📋 *Mi consulta:*%0A• Para: ${tipoTexto}%0A• Ubicación: ${formData.ubicacion}%0A• Sistema: ${sistemaTexto}%0A%0AQuiero recibir información sin compromiso.`;
    window.open(`https://wa.me/5493813522339?text=${mensaje}`, "_blank");
  };

  return (
    <section className="hero-security">
      <div className="security-video-fondo">
        <img
          src={VIDEO_POSTER}
          alt=""
          aria-hidden="true"
          className="video-poster"
          width="1280"
          height="720"
          fetchPriority="high"
        />
        <video
          className="video-bg"
          autoPlay
          muted
          loop
          playsInline
          poster={VIDEO_POSTER}
          aria-hidden="true"
        >
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO_MP4}  type="video/mp4"  />
        </video>
      </div>

      <div className="security-overlay" />

      <div className="security-contenedor">
        <div className="security-izquierda">
          <h2 className="security-titulo-camaras">
            Protegé tu casa o comercio
            <br />
            ante incendios con detección
            <br />
            temprana y alerta inmediata.
          </h2>
          <p className="security-subtitulo">
            Sensores inteligentes conectados a monitoreo activo 24/7<br />
            para actuar antes de que el riesgo sea mayor.
          </p>
          <p className="security-descripcion">
            <FontAwesomeIcon icon={faFireFlameCurved} className="icon-desc" aria-hidden="true" /> Detección temprana +{" "}
            <FontAwesomeIcon icon={faBell}            className="icon-desc" aria-hidden="true" /> alerta inmediata +{" "}
            <FontAwesomeIcon icon={faClock}           className="icon-desc" aria-hidden="true" /> monitoreo activo 24/7.
          </p>
          <div className="security-breadcrumb">
            <span>+40</span> Años de experiencia en seguridad en Tucumán
          </div>
        </div>

        <div className="security-derecha">
          <div className="security-form">
            <h3 className="form-titulo">Configurá tu Sistema en 3 Pasos</h3>

            <div className="form-steps-indicator">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`step-dot ${currentStep >= step ? "active" : ""}`}
                />
              ))}
            </div>

            {currentStep === 1 && (
              <div className="form-step">
                <h4 className="step-titulo">Paso 1: ¿Es para?</h4>
                <div className="step-opciones">
                  <button
                    onClick={() => handleOptionSelect("tipo", "casa")}
                    className={`opcion-btn ${formData.tipo === "casa" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "casa"}
                  >
                    <FontAwesomeIcon icon={faHome} className="btn-icon" aria-hidden="true" /> Casa
                  </button>
                  <button
                    onClick={() => handleOptionSelect("tipo", "comercio")}
                    className={`opcion-btn ${formData.tipo === "comercio" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "comercio"}
                  >
                    <FontAwesomeIcon icon={faBuilding} className="btn-icon" aria-hidden="true" /> Comercio
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h4 className="step-titulo">Paso 2: ¿Dónde querés instalar?</h4>
                <div className="step-opciones vertical">
                  {[
                    "San Miguel de Tucumán",
                    "Yerba Buena",
                    "Tafí Viejo",
                    "Tafí del Valle / El Mollar",
                    "Otra zona",
                  ].map((lugar) => (
                    <button
                      key={lugar}
                      onClick={() => handleOptionSelect("ubicacion", lugar)}
                      className={`opcion-btn ${formData.ubicacion === lugar ? "selected" : ""}`}
                      aria-pressed={formData.ubicacion === lugar}
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="btn-icon" aria-hidden="true" />{" "}
                      {lugar}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-volver"
                  aria-label="Volver al paso 1"
                >
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Volver
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h4 className="step-titulo">Paso 3: ¿Qué tipo de sistema buscás?</h4>
                <div className="step-opciones vertical">
                  {[
                    { value: "chico",         label: "Kit Chico",   desc: "(espacios reducidos)" },
                    { value: "mediano",        label: "Kit Mediano", desc: "(propiedad estándar)"  },
                    { value: "grande",         label: "Kit Grande",  desc: "(propiedad amplia)"    },
                    { value: "personalizado",  label: "Necesito asesoramiento personalizado", desc: "" },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      onClick={() => handleOptionSelect("sistema", opcion.value)}
                      className={`opcion-btn sistema ${formData.sistema === opcion.value ? "selected" : ""}`}
                      aria-pressed={formData.sistema === opcion.value}
                    >
                      <span className="opcion-label">{opcion.label}</span>
                      {opcion.desc && <span className="opcion-desc">{opcion.desc}</span>}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-volver"
                  aria-label="Volver al paso 2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Volver
                </button>
              </div>
            )}

            {currentStep === 3 && formData.sistema && (
              <div className="form-cta">
                <button onClick={handleSubmit} className="cta-principal">
                  <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" style={{ marginRight: "10px" }} />
                  Quiero asesoramiento ahora
                </button>
                <p className="cta-subtexto">
                  Instalación profesional • Equipos certificados • Más de 40 años en Tucumán
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="security-scroll">
          <button
            className="scroll-btn"
            aria-label="Ver más información"
            onClick={() => {
              const element = document.getElementById("beneficios");
              if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <span>Más Información</span>
            <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HerosecurityIncendio;