import { useState } from "react";
import useSecurityHeroGsap from "../../hooks/useSecurityHeroGsap";
import "./HeroSecurity.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faCar,
  faTruck,
  faLocationDot,
  faArrowLeft,
  faShield,
  faRoute,
  faGauge,
  faChevronDown,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import useFacebookPixelGPS from "../../hooks/useFacebookPixelGPS";
import useGoogleAnalyticsGPS from "../../hooks/useGoogleAnalyticsGPS";

// ─────────────────────────────────────────────────────────────
// URLs del video en Cloudinary
// ─────────────────────────────────────────────────────────────
const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";

const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";

const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const HeroSecurity = () => {
  useSecurityHeroGsap();

  const {
    trackTipoSelected,
    trackUbicacionSelected,
    trackSistemaSelected,
    trackFormComplete,
  } = useFacebookPixelGPS();

  const {
    trackTipoSelectedGA4,
    trackUbicacionSelectedGA4,
    trackSistemaSelectedGA4,
    trackLeadGA4,
  } = useGoogleAnalyticsGPS();

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

    const tipoTexto =
      {
        moto: "Moto",
        auto: "Auto / Camioneta",
        flota: "Flota de vehículos",
      }[formData.tipo] || formData.tipo;

    const sistemaTexto =
      {
        ubicacion: "Ubicación y seguridad del vehículo",
        control: "Control de uso y recorridos",
        gestion: "Gestión de flota y eficiencia",
        personalizado: "Asesoramiento personalizado",
      }[formData.sistema] || formData.sistema;

    const mensaje = `Hola! Quiero información sobre el servicio de monitoreo GPS.%0A%0A📋 *Mi consulta:*%0A• Vehículo: ${tipoTexto}%0A• Ubicación: ${formData.ubicacion}%0A• Necesidad: ${sistemaTexto}%0A%0AQuiero recibir información sin compromiso.`;
    const numero = "5493813522339";
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  };

  return (
    <section className="hero-security">

      {/* ── Video de fondo ──────────────────────────────────── */}
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
          <h2 className="security-titulo">
            Seguimiento Vehicular
            <br />
            Satelital.
          </h2>
          <p className="security-subtitulo">
            Controlá tu vehículo o flota con <br />
            seguimiento en tiempo real 24/7.
          </p>
          <p className="security-descripcion">
            <FontAwesomeIcon icon={faShield} className="icon-desc" aria-hidden="true" /> Rastreo GPS +{" "}
            <FontAwesomeIcon icon={faRoute} className="icon-desc" aria-hidden="true" /> historial de recorridos +{" "}
            <FontAwesomeIcon icon={faGauge} className="icon-desc" aria-hidden="true" /> control de velocidad y conducción{" "}
          </p>
          <div className="security-breadcrumb">
            <span>+40</span> Años de experiencia en seguridad en Tucumán
          </div>
        </div>

        <div className="security-derecha">
          <div className="security-form">
            <h3 className="form-titulo">Configurá tu Servicio en 3 Pasos</h3>

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
                <h4 className="step-titulo">Paso 1: ¿Qué vehículo querés monitorear?</h4>
                <div className="step-opciones">
                  <button
                    onClick={() => handleOptionSelect("tipo", "moto")}
                    className={`opcion-btn ${formData.tipo === "moto" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "moto"}
                  >
                    <FontAwesomeIcon icon={faMotorcycle} className="btn-icon" aria-hidden="true" /> Moto
                  </button>
                  <button
                    onClick={() => handleOptionSelect("tipo", "auto")}
                    className={`opcion-btn ${formData.tipo === "auto" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "auto"}
                  >
                    <FontAwesomeIcon icon={faCar} className="btn-icon" aria-hidden="true" />{" "}
                    Auto / Camioneta
                  </button>
                  <button
                    onClick={() => handleOptionSelect("tipo", "flota")}
                    className={`opcion-btn ${formData.tipo === "flota" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "flota"}
                  >
                    <FontAwesomeIcon icon={faTruck} className="btn-icon" aria-hidden="true" />{" "}
                    Flota de vehículos
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h4 className="step-titulo">Paso 2: ¿Dónde se utiliza principalmente?</h4>
                <div className="step-opciones vertical">
                  {[
                    "Yerba Buena",
                    "San Miguel de Tucumán",
                    "Tafí / El Mollar",
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
                <h4 className="step-titulo">
                  Paso 3: ¿Qué querés controlar principalmente?
                </h4>
                <div className="step-opciones vertical">
                  {[
                    { value: "ubicacion",    label: "Ubicación y seguridad del vehículo", desc: "" },
                    { value: "control",      label: "Control de uso y recorridos",        desc: "" },
                    { value: "gestion",      label: "Gestión de flota y eficiencia",      desc: "" },
                    { value: "personalizado", label: "Necesito asesoramiento personalizado", desc: "" },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      onClick={() => handleOptionSelect("sistema", opcion.value)}
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
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Volver
                </button>
              </div>
            )}

            {currentStep === 3 && formData.sistema && (
              <div className="form-cta">
                <button onClick={handleSubmit} className="cta-principal">
                  <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" style={{ marginRight: "10px" }} />
                  Quiero información ahora
                </button>
                <p className="cta-subtexto">
                  Instalación sin cargo • Equipos en comodato • Más de 40 años de trayectoria
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