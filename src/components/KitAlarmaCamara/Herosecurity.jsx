import { useRef, useState } from "react";
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
  faUser,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import useFacebookPixel from "../../hooks/useFacebookPixel";
import useGoogleAnalytics from "../../hooks/useGoogleAnalytics";

const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";
const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const SISTEMA_LABELS = {
  chico: "Mini",
  mediano: "Básico",
  grande: "Premium",
  personalizado: "Asesoramiento personalizado",
};

const normalizePhone = (value = "") => String(value || "").replace(/\D/g, "");
const isValidEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

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
    nombre: "",
    email: "",
    telefono: "",
  });
  const [formError, setFormError] = useState("");
  const submittedLeadKey = useRef("");

  const handleOptionSelect = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setFormError("");

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
    setFormError("");
  };

  const handleSubmit = (selectedData = formData) => {
    const nombre = String(selectedData.nombre || "").trim();
    const email = String(selectedData.email || "").trim().toLowerCase();
    const telefono = normalizePhone(selectedData.telefono);

    if (nombre.length < 2) {
      setFormError("Ingresá tu nombre para identificar la consulta.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Ingresá un email válido.");
      return;
    }

    if (telefono.length < 8) {
      setFormError("Ingresá un teléfono válido con característica.");
      return;
    }

    const completeData = { ...selectedData, nombre, email, telefono };
    const submissionKey = `${completeData.tipo}|${completeData.ubicacion}|${completeData.sistema}|${email}|${telefono}`;
    if (submittedLeadKey.current === submissionKey) return;
    submittedLeadKey.current = submissionKey;

    localStorage.setItem("albiero_nombre", nombre);
    localStorage.setItem("albiero_email", email);
    localStorage.setItem("albiero_telefono", telefono);

    trackFormComplete(completeData);
    trackLeadGA4(completeData);

    const tipoTexto = completeData.tipo === "casa" ? "Casa" : "Comercio";
    const sistemaTexto = SISTEMA_LABELS[completeData.sistema] || completeData.sistema;

    const mensaje = encodeURIComponent(
      `Hola! Quiero asesoramiento por el Kit de Alarma y Cámara.\n\n` +
      `Mi consulta:\n` +
      `Nombre: ${nombre}\n` +
      `Email: ${email}\n` +
      `Teléfono: ${telefono}\n` +
      `Para: ${tipoTexto}\n` +
      `Ubicación: ${completeData.ubicacion}\n` +
      `Sistema: ${sistemaTexto}\n\n` +
      `Quiero recibir información sin compromiso.`
    );
    const whatsappUrl = `https://wa.me/5493813522339?text=${mensaje}`;
    const whatsappWindow = window.open("about:blank", "_blank");

    setTimeout(() => {
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, "_blank");
      }
    }, 1500);
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
            <FontAwesomeIcon icon={faShield} className="icon-desc" aria-hidden="true" />{" "}
            Alarma +{" "}
            <FontAwesomeIcon icon={faCamera} className="icon-desc" aria-hidden="true" />{" "}
            cámaras +{" "}
            <FontAwesomeIcon icon={faClock}  className="icon-desc" aria-hidden="true" />{" "}
            central activa 24/7 +{" "}
            <FontAwesomeIcon icon={faCar}    className="icon-desc" aria-hidden="true" />{" "}
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
                    <FontAwesomeIcon icon={faHome} className="btn-icon" aria-hidden="true" />{" "}Casa
                  </button>
                  <button
                    onClick={() => handleOptionSelect("tipo", "comercio")}
                    className={`opcion-btn ${formData.tipo === "comercio" ? "selected" : ""}`}
                    aria-pressed={formData.tipo === "comercio"}
                  >
                    <FontAwesomeIcon icon={faBuilding} className="btn-icon" aria-hidden="true" />{" "}Comercio
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
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />{" "}Volver
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
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />{" "}Volver
                </button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="form-step">
                <h4 className="step-titulo">Datos de contacto</h4>
                <div className="contact-fields">
                  <label className="contact-field">
                    <span><FontAwesomeIcon icon={faUser} aria-hidden="true" /> Nombre</span>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(event) => handleContactChange("nombre", event.target.value)}
                      autoComplete="name"
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label className="contact-field">
                    <span><FontAwesomeIcon icon={faPhone} aria-hidden="true" /> Teléfono</span>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(event) => handleContactChange("telefono", event.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="381 123 4567"
                    />
                  </label>
                  <label className="contact-field">
                    <span><FontAwesomeIcon icon={faEnvelope} aria-hidden="true" /> Email</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => handleContactChange("email", event.target.value)}
                      autoComplete="email"
                      placeholder="tu@email.com"
                    />
                  </label>
                </div>
                {formError && <p className="form-error">{formError}</p>}
                <div className="form-cta">
                  <button className="cta-principal" type="button" onClick={() => handleSubmit(formData)}>
                    Enviar por WhatsApp
                  </button>
                  <p className="cta-subtexto">Usamos estos datos solo para responder tu consulta y mejorar el seguimiento.</p>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="btn-volver"
                  aria-label="Volver al paso 3"
                >
                  <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />{" "}Volver
                </button>
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

export default HeroSecurity;


