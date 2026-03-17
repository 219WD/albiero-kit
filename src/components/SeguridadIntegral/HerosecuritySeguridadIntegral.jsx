import { useState } from "react";
import useSecurityHeroGsap from "../../hooks/useSecurityHeroGsap.js";
import "./HerosecuritySeguridadIntegral.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faStore,
  faLocationDot,
  faArrowLeft,
  faShield,
  faLayerGroup,
  faChevronDown,
  faWarehouse,
  faHouse,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import useFacebookPixelSeguridadIntegral from "../../hooks/useFacebookPixelSeguridadIntegral.js";
import useGoogleAnalyticsSeguridadIntegral from "../../hooks/useGoogleAnalyticsSeguridadIntegral.js";

const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";
const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe-4GM8l5t2r7wMki0tspCV7OXoGd75BW9DaKovyBqXm6vHyg/formResponse";

const HerosecuritySeguridadIntegral = () => {
  useSecurityHeroGsap();

  const {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  } = useFacebookPixelSeguridadIntegral();

  const {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4,
  } = useGoogleAnalyticsSeguridadIntegral();

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
      "entry.633861612":  "SeguridadIntegral",
      "entry.1390851687": localStorage.getItem("albiero_subscribed") ? "Si" : "",
      submit: "Submit",
    });

    fetch(`${FORM_URL}?${params.toString()}`, {
      method: "POST",
      mode:   "no-cors",
    });
    // ── Fin envío Sheet ──────────────────────────────────────────────────────

    const tipoTexto = {
      empresa:    "Empresa",
      comercio:   "Comercio",
      barrio:     "Barrio privado",
      deposito:   "Depósito / predio",
      particular: "Propiedad particular",
    }[formData.tipo] || formData.tipo;

    const sistemaTexto = {
      guardias:     "Seguridad física con guardias",
      perimetral:   "Protección perimetral electrónica",
      accesos:      "Control de accesos",
      integral:     "Sistema integral completo",
      personalizado:"Asesoramiento personalizado",
    }[formData.sistema] || formData.sistema;

    const mensaje = `Hola! Quiero asesoramiento por el sistema de seguridad integral.%0A%0A📋 *Mi consulta:*%0A• Para: ${tipoTexto}%0A• Ubicación: ${formData.ubicacion}%0A• Solución: ${sistemaTexto}%0A%0AQuiero recibir información sin compromiso.`;
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
          <h2 className="security-titulo-alarmas">
            Protegé tu empresa o
            <br />
            propiedad con un sistema
            <br />
            de seguridad integral.
          </h2>
          <p className="security-subtitulo">
            Soluciones combinadas de seguridad física y electrónica<br />
            diseñadas según el riesgo y las necesidades de cada espacio.
          </p>
          <p className="security-descripcion">
            <FontAwesomeIcon icon={faShield}     className="icon-desc" aria-hidden="true" /> Seguridad física +{" "}
            <FontAwesomeIcon icon={faLayerGroup} className="icon-desc" aria-hidden="true" /> protección electrónica +{" "}
            <FontAwesomeIcon icon={faBuilding}   className="icon-desc" aria-hidden="true" /> soluciones a medida.
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
                <h4 className="step-titulo">Paso 1: ¿Qué tipo de propiedad querés proteger?</h4>
                <div className="step-opciones vertical">
                  {[
                    { value: "empresa",    icon: faLandmark,  label: "Empresa"             },
                    { value: "comercio",   icon: faStore,     label: "Comercio"             },
                    { value: "barrio",     icon: faHouse,     label: "Barrio privado"       },
                    { value: "deposito",   icon: faWarehouse, label: "Depósito / predio"    },
                    { value: "particular", icon: faBuilding,  label: "Propiedad particular" },
                  ].map((op) => (
                    <button
                      key={op.value}
                      onClick={() => handleOptionSelect("tipo", op.value)}
                      className={`opcion-btn ${formData.tipo === op.value ? "selected" : ""}`}
                      aria-pressed={formData.tipo === op.value}
                    >
                      <FontAwesomeIcon icon={op.icon} className="btn-icon" aria-hidden="true" />{" "}
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h4 className="step-titulo">Paso 2: ¿Dónde necesitás el servicio?</h4>
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
                <h4 className="step-titulo">Paso 3: ¿Qué tipo de solución buscás?</h4>
                <div className="step-opciones vertical">
                  {[
                    { value: "guardias",      label: "Seguridad física con guardias"      },
                    { value: "perimetral",    label: "Protección perimetral electrónica"  },
                    { value: "accesos",       label: "Control de accesos"                 },
                    { value: "integral",      label: "Sistema integral completo"          },
                    { value: "personalizado", label: "Necesito asesoramiento personalizado" },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      onClick={() => handleOptionSelect("sistema", opcion.value)}
                      className={`opcion-btn sistema ${formData.sistema === opcion.value ? "selected" : ""}`}
                      aria-pressed={formData.sistema === opcion.value}
                    >
                      <span className="opcion-label">{opcion.label}</span>
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
                  Diagnóstico sin costo • Soluciones a medida • Más de 40 años en Tucumán
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

export default HerosecuritySeguridadIntegral;