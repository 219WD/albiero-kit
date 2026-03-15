import { useState } from "react";
import useSecurityHeroGsap from "../../hooks/useSecurityHeroGsap";
import "./HeroSecurity.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBuilding,
  faLocationDot,
  faArrowLeft,
  faShield,
  faCamera,
  faCar,
  faClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import useFacebookPixel from "../../hooks/useFacebookPixel";
import useGoogleAnalytics from "../../hooks/useGoogleAnalytics";

// ─────────────────────────────────────────────────────────────
// URLs del video en Cloudinary
// ─────────────────────────────────────────────────────────────
const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";

// WebM: Cloudinary convierte automáticamente — más liviano en Chrome/Firefox
const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";

// Poster: thumbnail automático del frame 0, servido como imagen optimizada
const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const HeroSecurity = () => {
  useSecurityHeroGsap();

  const {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  } = useFacebookPixel();

  const {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4,
  } = useGoogleAnalytics();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo: "",
    ubicacion: "",
    sistema: "",
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

    // Tomar email y nombre del localStorage si el usuario ya se registró
    const email = localStorage.getItem("albiero_email") || "-";
    const nombre = localStorage.getItem("albiero_nombre") || "-";

    // Guardar silenciosamente en el Sheet
    const FORM_URL =
      "https://docs.google.com/forms/d/e/1FAIpQLSe-4GM8l5t2r7wMki0tspCV7OXoGd75BW9DaKovyBqXm6vHyg/formResponse";
    const codigo =
      "ALB-" + Math.random().toString(36).substring(2, 7).toUpperCase();
    const params = new URLSearchParams({
      "entry.150801547": email,
      "entry.586312181": nombre,
      "entry.1712587123": codigo,
      "entry.918807836": formData.tipo,
      "entry.101350454": formData.ubicacion,
      "entry.865536607": formData.sistema,
      submit: "Submit",
    });
    fetch(`${FORM_URL}?${params.toString()}`, {
      method: "POST",
      mode: "no-cors",
    });

    // Abrir WhatsApp igual que antes
    const tipoTexto = formData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto =
      {
        chico: "Kit Chico (ambientes reducidos)",
        mediano: "Kit Mediano (propiedad estándar)",
        grande: "Kit Grande (propiedad amplia)",
        personalizado: "Asesoramiento personalizado",
      }[formData.sistema] || formData.sistema;

    const mensaje = `Hola! Quiero asesoramiento por el Kit de Alarma y Cámara.%0A%0A📋 *Mi consulta:*%0A• Para: ${tipoTexto}%0A• Ubicación: ${formData.ubicacion}%0A• Sistema: ${sistemaTexto}%0A%0AQuiero recibir información sin compromiso.`;
    window.open(`https://wa.me/5493813522339?text=${mensaje}`, "_blank");
  };

  return (
    <section className="hero-security">
      {/* ── Video de fondo ────────────────────────────────────
          Desktop: video HTML5 nativo (sin Vimeo, sin cookies)
          Mobile:  video oculto via CSS, solo carga el poster
      ──────────────────────────────────────────────────────── */}
      <div className="security-video-fondo">
        {/* Poster: imagen estática visible mientras el video carga */}
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
          <source src={VIDEO_MP4} type="video/mp4" />
        </video>
      </div>

      <div className="security-overlay" />

      <div className="security-contenedor">
        <div className="security-izquierda">
          <h2 className="security-titulo">
            Albiero Seguridad
            <br />
            Alarma+Cámara.
          </h2>
          <p className="security-subtitulo">
            Protegé tu casa o negocio con <br />
            monitoreo real y respuesta inmediata.
          </p>
          <p className="security-descripcion">
            <FontAwesomeIcon
              icon={faShield}
              className="icon-desc"
              aria-hidden="true"
            />{" "}
            Alarma +{" "}
            <FontAwesomeIcon
              icon={faCamera}
              className="icon-desc"
              aria-hidden="true"
            />{" "}
            cámaras +{" "}
            <FontAwesomeIcon
              icon={faClock}
              className="icon-desc"
              aria-hidden="true"
            />{" "}
            central activa 24/7 +{" "}
            <FontAwesomeIcon
              icon={faCar}
              className="icon-desc"
              aria-hidden="true"
            />{" "}
            móviles propios en tu zona.
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
                    <FontAwesomeIcon
                      icon={faHome}
                      className="btn-icon"
                      aria-hidden="true"
                    />{" "}
                    Casa
                  </button>
                  <button
                    onClick={() => handleOptionSelect("tipo", "comercio")}
                    className={`opcion-btn ${formData.tipo === "comercio" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "comercio"}
                  >
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="btn-icon"
                      aria-hidden="true"
                    />{" "}
                    Comercio
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h4 className="step-titulo">Paso 2: ¿Dónde querés instalar?</h4>
                <div className="step-opciones vertical">
                  {[
                    "Yerba Buena",
                    "San Miguel de Tucumán",
                    "Tafí Viejo",
                    "Tafí del Valle",
                    "El Mollar",
                    "Otra zona",
                  ].map((lugar) => (
                    <button
                      key={lugar}
                      onClick={() => handleOptionSelect("ubicacion", lugar)}
                      className={`opcion-btn ${formData.ubicacion === lugar ? "selected" : ""}`}
                      aria-pressed={formData.ubicacion === lugar}
                    >
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="btn-icon"
                        aria-hidden="true"
                      />{" "}
                      {lugar}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-volver"
                  aria-label="Volver al paso 1"
                >
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />{" "}
                  Volver
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h4 className="step-titulo">
                  Paso 3: ¿Qué tipo de sistema buscás?
                </h4>
                <div className="step-opciones vertical">
                  {[
                    {
                      value: "chico",
                      label: "Kit Chico",
                      desc: "(ambientes reducidos)",
                    },
                    {
                      value: "mediano",
                      label: "Kit Mediano",
                      desc: "(propiedad estándar)",
                    },
                    {
                      value: "grande",
                      label: "Kit Grande",
                      desc: "(propiedad amplia)",
                    },
                    {
                      value: "personalizado",
                      label: "Necesito asesoramiento personalizado",
                      desc: "",
                    },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      onClick={() =>
                        handleOptionSelect("sistema", opcion.value)
                      }
                      className={`opcion-btn sistema ${formData.sistema === opcion.value ? "selected" : ""}`}
                      aria-pressed={formData.sistema === opcion.value}
                    >
                      <span className="opcion-label">{opcion.label}</span>
                      {opcion.desc && (
                        <span className="opcion-desc">{opcion.desc}</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-volver"
                  aria-label="Volver al paso 2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />{" "}
                  Volver
                </button>
              </div>
            )}

            {currentStep === 3 && formData.sistema && (
              <div className="form-cta">
                <button onClick={handleSubmit} className="cta-principal">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    aria-hidden="true"
                    style={{ marginRight: "10px" }}
                  />
                  Quiero asesoramiento ahora
                </button>
                <p className="cta-subtexto">
                  Instalación sin costo • Sistema en comodato • Más de 40 años
                  en Tucumán
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
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
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

export default HeroSecurity;
