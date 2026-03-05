import { useState, useEffect } from "react";
import useSecurityHeroGsap from "../hooks/useSecurityHeroGsap";
import "./HeroSecurity.css";
// Importar Font Awesome
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
// Importar faWhatsapp desde free-brands-svg-icons
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import useFacebookPixel from "../hooks/useFacebookPixel";

const HeroSecurity = () => {
  useSecurityHeroGsap();

  const { trackFormStep, trackFormComplete, trackFormAbandonment } = useFacebookPixel();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    tipo: "",
    ubicacion: "",
    sistema: "",
  });

  // Trackear cuando el usuario avanza de paso
  useEffect(() => {
    if (currentStep > 1) {
      trackFormStep(currentStep, formData);
    }
  }, [currentStep, formData, trackFormStep]);

  // Detectar abandono del formulario
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentStep < 3 || (currentStep === 3 && !formData.sistema)) {
        trackFormAbandonment(currentStep, formData);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, formData, trackFormAbandonment]);

  const handleOptionSelect = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Trackear selección específica en cada paso
      if (field === 'tipo') {
        trackFormStep(1, { tipo: value === 'casa' ? 'Casa' : 'Comercio' });
      } else if (field === 'ubicacion') {
        trackFormStep(2, { ...prev, ubicacion: value });
      } else if (field === 'sistema') {
        trackFormStep(3, { ...prev, sistema: value });
      }
      
      return newData;
    });

    // Auto-avanzar al siguiente paso
    if (currentStep < 3) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = () => {
    // Trackear formulario completado en Pixel
    trackFormComplete(formData);
    
    // Crear el mensaje para WhatsApp con los datos del formulario
    const tipoTexto = formData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto =
      {
        chico: "Kit Chico (ambientes reducidos)",
        mediano: "Kit Mediano (propiedad estándar)",
        grande: "Kit Grande (propiedad amplia)",
        personalizado: "Asesoramiento personalizado",
      }[formData.sistema] || formData.sistema;

    const mensaje = `Hola! Quiero asesoramiento por el Kit de Alarma y Cámara.%0A%0A📋 *Mi consulta:*%0A• Para: ${tipoTexto}%0A• Ubicación: ${formData.ubicacion}%0A• Sistema: ${sistemaTexto}%0A%0AQuiero recibir información sin compromiso.`;

    // Número de WhatsApp
    const numero = "5493813522339";

    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/${numero}?text=${mensaje}`, "_blank");

    console.log("Form data enviada a WhatsApp y Pixel:", formData);
  };

  return (
    <section className="hero-security">
      {/* Video de fondo de Vimeo */}
      <div className="security-video-fondo">
        <iframe
          src="https://player.vimeo.com/video/1170315247?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          title="video-bg"
        />
      </div>

      {/* Overlay */}
      <div className="security-overlay" />

      {/* Contenido */}
      <div className="security-contenedor">
        {/* Columna izquierda: Títulos */}
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

          {/* Breadcrumb */}
          <div className="security-breadcrumb">
            <span>+40</span> Años de experiencia en seguridad en Tucumán
          </div>
        </div>

        {/* Columna derecha: Formulario */}
        <div className="security-derecha">
          <div className="security-form">
            <h3 className="form-titulo">Configurá tu Sistema en 3 Pasos</h3>

            {/* Indicador de pasos */}
            <div className="form-steps-indicator">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`step-dot ${currentStep >= step ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Paso 1: Tipo */}
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

            {/* Paso 2: Ubicación */}
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
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="btn-icon"
                      />{" "}
                      {lugar}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn-volver"
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Volver
                </button>
              </div>
            )}

            {/* Paso 3: Sistema */}
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
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Volver
                </button>
              </div>
            )}

            {/* Botón CTA */}
            {currentStep === 3 && formData.sistema && (
              <div className="form-cta">
                <button onClick={handleSubmit} className="cta-principal">
                  <FontAwesomeIcon
                    icon={faWhatsapp}
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

        {/* Scroll indicator */}
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