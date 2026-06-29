import { useRef, useState } from "react";
import useSecurityHeroGsap from "../../hooks/useSecurityHeroGsap";
import "./HerosecurityAlarmas.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBuilding,
  faLocationDot,
  faArrowLeft,
  faShield,
  faCar,
  faClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import useFacebookPixel from "../../hooks/useFacebookPixelAlarmas.js";
import useGoogleAnalytics from "../../hooks/useGoogleAnalyticsAlarmas.js";
import LeadContactStep from "../common/LeadContactStep.jsx";
import { openWhatsAppLead, persistLeadContact, validateLeadContact } from "../../utils/leadContact.js";

const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";
const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const SISTEMA_LABELS = {
  chico: "Mini (ambientes reducidos)",
  mediano: "Basico (propiedad estandar)",
  grande: "Premium (propiedad amplia)",
  personalizado: "Asesoramiento personalizado",
};

const HerosecurityAlarmas = () => {
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
    tipo:      "",
    ubicacion: "",
    sistema:   "",
    nombre:    "",
    email:     "",
    telefono:  "",
  });
  const [formError, setFormError] = useState("");
  const submittedLeadKey = useRef("");

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

    if (currentStep < 4) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleContactChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (formError) setFormError("");
  };

  const handleSubmit = (selectedData = formData) => {
    const contact = validateLeadContact(selectedData);
    if (contact.error) {
      setFormError(contact.error);
      return;
    }

    const completeData = { ...selectedData, ...contact };
    const submissionKey = `${completeData.tipo}|${completeData.ubicacion}|${completeData.sistema}|${completeData.email}|${completeData.telefono}`;
    if (submittedLeadKey.current === submissionKey) return;
    submittedLeadKey.current = submissionKey;

    persistLeadContact(contact);
    trackFormComplete(completeData);
    trackLeadGA4(completeData);

    const tipoTexto = completeData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto = SISTEMA_LABELS[completeData.sistema] || completeData.sistema;

    openWhatsAppLead({
      intro: "Hola! Quiero asesoramiento por el sistema de alarmas monitoreadas.",
      details: [
        ["Nombre", completeData.nombre],
        ["Email", completeData.email],
        ["WhatsApp", completeData.telefono],
        ["Para", tipoTexto],
        ["Ubicacion", completeData.ubicacion],
        ["Sistema", sistemaTexto],
      ],
    });
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
            Protegé tu casa o comercio
            <br />
            con alarmas monitoreadas
            <br />
            y respuesta inmediata.
          </h2>
          <p className="security-subtitulo">
            Sistema de alarma conectado a central activa 24/7<br />
            con móviles propios en tu zona.
          </p>
          <p className="security-descripcion">
            <FontAwesomeIcon icon={faShield} className="icon-desc" aria-hidden="true" /> Alarma monitoreada +{" "}
            <FontAwesomeIcon icon={faClock}  className="icon-desc" aria-hidden="true" /> central activa 24/7 +{" "}
            <FontAwesomeIcon icon={faCar}    className="icon-desc" aria-hidden="true" /> móviles propios en tu zona.
          </p>
          <div className="security-breadcrumb">
            <span>+40</span> Años de experiencia en seguridad en Tucumán
          </div>
        </div>

        <div className="security-derecha">
          <div className="security-form">
            <h3 className="form-titulo">Configurá tu Sistema en 4 Pasos</h3>

            <div className="form-steps-indicator">
              {[1, 2, 3, 4].map((step) => (
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
                    { value: "chico",         label: "Mini",    desc: "(ambientes reducidos)" },
                    { value: "mediano",        label: "Básico",  desc: "(propiedad estándar)"  },
                    { value: "grande",         label: "Premium",   desc: "(propiedad amplia)"    },
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

            {currentStep === 4 && (
              <LeadContactStep
                formData={formData}
                formError={formError}
                onChange={handleContactChange}
                onBack={() => setCurrentStep(3)}
                onSubmit={() => handleSubmit(formData)}
              />
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

export default HerosecurityAlarmas;

