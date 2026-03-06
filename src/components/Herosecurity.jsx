import { useState } from "react";
import useSecurityHeroGsap from "../hooks/useSecurityHeroGsap";
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
import useFacebookPixel from "../hooks/useFacebookPixel";
import useGoogleAnalytics from "../hooks/useGoogleAnalytics";

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

    const tipoTexto = formData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto =
      {
        chico: "Kit Chico (ambientes reducidos)",
        mediano: "Kit Mediano (propiedad estándar)",
        grande: "Kit Grande (propiedad amplia)",
        personalizado: "Asesoramiento personalizado",
      }[formData.sistema] || formData.sistema;

    const mensaje = `Hola! Quiero asesoramiento por el Kit de Alarma y Cámara.%0A%0A📋 *Mi consulta:*%0A• Para: ${tipoTexto}%0A• Ubicación: ${formData.ubicacion}%0A• Sistema: ${sistemaTexto}%0A%0AQuiero recibir información sin compromiso.`;
    const numero = "5493813522339";
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");
  };

  return (
    <section className="hero-security">
      <div className="security-video-fondo">
        <iframe
          src="https://player.vimeo.com/video/1170315247?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          title="video-bg"
        />
      </div>

      <div className="security-overlay" />

      <div className="security-contenedor">
        <div className="security-izquierda">
          <h1 className="security-titulo">
            Albiero Seguridad
            <br />
            Alarma+Cámara.
          </h1>
          <p className="security-subtitulo">
            Protegé tu casa o negocio con <br />
            monitoreo real y respuesta inmediata.
          </p>
          <p className="security-descripcion">
            <FontAwesomeIcon icon={faShield} className="icon-desc" /> Alarma +{" "}
            <FontAwesomeIcon icon={faCamera} className="icon-desc" /> cámaras +{" "}
            <FontAwesomeIcon icon={faClock} className="icon-desc" /> central
            activa 24/7 + <FontAwesomeIcon icon={faCar} className="icon-desc" />{" "}
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
                  >
                    <FontAwesomeIcon icon={faHome} className="btn-icon" /> Casa
                  </button>
                  <button
                    onClick={() => handleOptionSelect("tipo", "comercio")}
                    className={`opcion-btn ${formData.tipo === "comercio" ? "selected" : ""}`}
                  >
                    <FontAwesomeIcon icon={faBuilding} className="btn-icon" />{" "}
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
                    >
                      <FontAwesomeIcon icon={faLocationDot} className="btn-icon" />{" "}
                      {lugar}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentStep(1)} className="btn-volver">
                  <FontAwesomeIcon icon={faArrowLeft} /> Volver
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
                    { value: "chico",        label: "Kit Chico",    desc: "(ambientes reducidos)" },
                    { value: "mediano",       label: "Kit Mediano",  desc: "(propiedad estándar)"  },
                    { value: "grande",        label: "Kit Grande",   desc: "(propiedad amplia)"    },
                    { value: "personalizado", label: "Necesito asesoramiento personalizado", desc: "" },
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      onClick={() => handleOptionSelect("sistema", opcion.value)}
                      className={`opcion-btn sistema ${formData.sistema === opcion.value ? "selected" : ""}`}
                    >
                      <span className="opcion-label">{opcion.label}</span>
                      {opcion.desc && (
                        <span className="opcion-desc">{opcion.desc}</span>
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentStep(2)} className="btn-volver">
                  <FontAwesomeIcon icon={faArrowLeft} /> Volver
                </button>
              </div>
            )}

            {currentStep === 3 && formData.sistema && (
              <div className="form-cta">
                <button onClick={handleSubmit} className="cta-principal">
                  <FontAwesomeIcon icon={faWhatsapp} style={{ marginRight: "10px" }} />
                  Quiero asesoramiento ahora
                </button>
                <p className="cta-subtexto">
                  Instalación sin costo • Sistema en comodato • Más de 40 años en Tucumán
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="security-scroll">
          <button
            className="scroll-btn"
            onClick={() => {
              const element = document.getElementById("beneficios");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            <span>Más Información</span>
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSecurity;