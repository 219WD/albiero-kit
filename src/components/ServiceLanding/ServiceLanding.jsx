import React from "react";
import "../Alarmas/HerosecurityAlarmas.css";
import "../Alarmas/FinalCTA.css";
import "../Alarmas/SecurityMarquee.css";
import "./ServiceLanding.css";
import HeroNavAlarmas from "../Alarmas/HeroNavAlarmas";
import Footer from "../Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBuilding,
  faCheckCircle,
  faChevronRight,
  faClock,
  faLocationDot,
  faQuestionCircle,
  faShieldHalved,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const WHATSAPP_NUMBER = "5493813522339";

const heroVideoMp4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";
const heroVideoWebm =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";
const heroPoster =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const iconCycle = [
  faShieldHalved,
  faVideo,
  faBuilding,
  faClock,
  faLocationDot,
  faCheckCircle,
];

const clUrl = (originalUrl, { w, h }) => {
  const transform = `w_${w},h_${h},c_fill,f_auto,q_auto`;
  return originalUrl.replace("/upload/", `/upload/${transform}/`);
};

const marqueeImageSources = {
  monitoreo: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/monitoreo_iqv0mn.jpg",
  camara: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815810/camara_qkq4st.jpg",
  movil: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/movil_v16g6k.jpg",
  equipo: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/equipo_z4zk7b.jpg",
  atencion: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815811/atencion_ltbz78.jpg",
  atencionDos: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817013/atencion2_ygnn0i.jpg",
  guardia: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772817081/guardia_qzg86d.jpg",
  instalacion: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/instalacion_n57src.jpg",
  mecanico: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092439/mecanico_mpff4d.jpg",
  comercial: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815811/comercial_xrbkz2.jpg",
  casa: "https://res.cloudinary.com/dtxdv136u/image/upload/v1772815812/casa_zjuefv.jpg",
  gpsUbicacion: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092440/moto_bgurrs.png",
  gpsHistorial: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092457/historial_iozxez.png",
  gpsMetricas: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092445/metricas_cllxnz.jpg",
  gpsAlerta: "https://res.cloudinary.com/dtxdv136u/image/upload/v1773092455/alertavelocidad_ovtmnt.png",
  accesosBarreras: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795723/8fb2635e-6006-4bb9-8ad3-14cd4daab806_xguers.png",
  emergenciaRespuesta: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795741/edb7a8c4-da24-4fb1-aa80-fb5deaaf753f_pvw46s.png",
  totemPorteria: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795740/75d0bee0-3ca3-4354-99e5-999b0f5be87e_fzhvox.png",
  barrerasVehiculares: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795741/0570949d-994d-41ed-aa50-1772aeb57fd9_dpe9fg.png",
  molinetesPeatonales: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795740/4184d701-fc1b-4361-bdf0-1fe56ad2fa65_ozwfts.png",
  detectoresMetales: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795723/1d50ffbf-4f94-4b21-a7c8-f805e7a86baa_hfmuza.png",
  sistemasBiometricos: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795741/fdea9621-fec5-4cad-a36d-be435d56c017_kslamu.png",
  mascotaRastreo: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795742/db654cf2-e772-4ec3-a5f3-5d2d358487b9_xj53ub.png",
  mascotaCelular: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795741/bed3fca8-8502-41b6-b2bd-3a46129e3137_dzrg4z.png",
  rondasMotos: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795740/9a23379a-d7b7-4b74-ba48-228bd7806230_hsszvm.png",
  accesoFacial: "https://res.cloudinary.com/dtxdv136u/image/upload/v1788795741/f237f6c9-5290-4088-9f40-66077d96f22b_keycm7.png",
};

const cardDims = { w: 380, h: 570 };
const wideCardDims = { w: 750, h: 500 };
const squareLikeDims = { w: 570, h: 570 };

const serviceImageMap = {
  "seguridad-en-obras": {
    "Equipos en comodato": "equipo",
    "Asesoramiento para el proyecto": "atencion",
    "Sistema provisorio": "instalacion",
    "Rondas y control": "movil",
  },
  totem: {
    "Porteria virtual": "totemPorteria",
    "Atencion en tiempo real": "atencionDos",
    "Camaras y monitoreo": "monitoreo",
    "Emergencia y respuesta": "emergenciaRespuesta",
  },
  "control-de-acceso": {
    "Sistemas biometricos": "sistemasBiometricos",
    "Barreras vehiculares": "barrerasVehiculares",
    "Molinetes peatonales": "molinetesPeatonales",
    "Detectores de metales": "detectoresMetales",
  },
  "monitoreo-de-mascotas": {
    "Dispositivo de rastreo": "mascotaRastreo",
    "Visualizacion desde el celular": "mascotaCelular",
    "Notificaciones en tiempo real": "gpsAlerta",
    "Conexion Albiero": "monitoreo",
  },
  "seguridad-perimetral": {
    "Guardias y porteria": "guardia",
    "Rondas y motos": "rondasMotos",
    "Accesos y barreras": "accesosBarreras",
    "Camaras con deteccion": "camara",
  },
  "seguridad-fisica": {
    "Seguridad continua": "guardia",
    "Seguridad para eventos": "comercial",
    "Guardias capacitados": "guardia",
    "Procedimientos especiales": "atencion",
  },
  "edificio-seguro": {
    "Totem de porteria virtual": "atencion",
    "Monitoreo de camaras con IA": "monitoreo",
    "Control de acceso facial": "accesoFacial",
    "Emergencia y respuesta": "emergenciaRespuesta",
  },
};

function getImageDims(imageKey) {
  if (imageKey === "equipo" || imageKey === "gpsMetricas") return wideCardDims;
  if (
    imageKey === "gpsUbicacion" ||
    imageKey === "gpsHistorial" ||
    imageKey === "gpsAlerta" ||
    imageKey === "accesosBarreras" ||
    imageKey === "emergenciaRespuesta" ||
    imageKey === "totemPorteria" ||
    imageKey === "barrerasVehiculares" ||
    imageKey === "molinetesPeatonales" ||
    imageKey === "detectoresMetales" ||
    imageKey === "sistemasBiometricos" ||
    imageKey === "mascotaRastreo" ||
    imageKey === "mascotaCelular" ||
    imageKey === "rondasMotos" ||
    imageKey === "accesoFacial"
  ) {
    return squareLikeDims;
  }
  return cardDims;
}

function buildMarqueeItems(service) {
  return service.includes.map((item, index) => ({
    ...item,
    icon: iconCycle[index % iconCycle.length],
    imageKey:
      serviceImageMap[service.slug]?.[item.title] ||
      ["monitoreo", "camara", "movil", "equipo"][index % 4],
  })).map((item) => {
    const dims = getImageDims(item.imageKey);
    return {
      ...item,
      image: clUrl(marqueeImageSources[item.imageKey], dims),
      dims,
    };
  });
}

function openWhatsApp(service) {
  const message = encodeURIComponent(service.whatsappText);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

export default function ServiceLanding({ service }) {
  const marqueeItems = buildMarqueeItems(service);
  const duplicatedMarqueeItems = [...marqueeItems, ...marqueeItems];

  return (
    <div className="service-page">
      <HeroNavAlarmas />

      <main>
        <section className="hero-security service-hero" id="hero-security">
          <div className="security-video-fondo">
            <img src={heroPoster} alt="" className="video-poster" aria-hidden="true" />
            <video
              className="video-bg"
              autoPlay
              muted
              loop
              playsInline
              poster={heroPoster}
              preload="metadata"
              aria-hidden="true"
            >
              <source src={heroVideoWebm} type="video/webm" />
              <source src={heroVideoMp4} type="video/mp4" />
            </video>
          </div>
          <div className="security-overlay service-hero__overlay" />

          <div className="security-contenedor service-hero__grid">
            <div className="security-izquierda service-hero__copy">
              <p className="security-breadcrumb">
                Servicios Albiero / <span>{service.productName}</span>
              </p>
              <span className="service-hero__eyebrow">{service.eyebrow}</span>
              <h1 className="security-titulo-alarmas service-hero__h1">{service.h1}</h1>
              <p className="security-subtitulo service-hero__title">{service.heroTitle}</p>
              <p className="security-descripcion service-hero__description">
                {service.description}
              </p>
              <div className="service-hero__actions">
                <button className="service-primary-btn" onClick={() => openWhatsApp(service)}>
                  <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
                  <span>{service.ctaLabel}</span>
                </button>
                <a className="service-secondary-link" href="#que-incluye">
                  <span>Ver que incluye</span>
                  <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside className="service-hero__panel" aria-label={`Resumen de ${service.productName}`}>
              <span className="service-panel__label">Solucion Albiero</span>
              <h2>{service.subtitle}</h2>
              <div className="service-panel__highlights">
                {service.highlights.map((item) => (
                  <div className="service-panel__highlight" key={item}>
                    <FontAwesomeIcon icon={faCheckCircle} aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="security-marquee-container service-marquee" id="beneficios">
          <div className="marquee-header">
            <div className="marquee-badge">
              <FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" />
              <span>{service.productName}</span>
            </div>
            <h2 className="marquee-title">
              Una solucion completa, <span className="marquee-gradient">lista para operar.</span>
            </h2>
            <p className="marquee-subtitle">
              Estos son los componentes clave que se combinan para que el servicio funcione como
              parte del ecosistema Albiero.
            </p>
          </div>

          <div className="marquee-wrapper">
            <div className="marquee-track service-marquee__track">
              {duplicatedMarqueeItems.map((item, index) => (
                <article className="marquee-card service-marquee__card" key={`${item.title}-${index}`}>
                  <div className="card-image-container">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="card-background-image"
                      width={item.dims.w}
                      height={item.dims.h}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="card-overlay" />
                  </div>
                  <div className="card-content service-marquee__content">
                    <div className="card-icon">
                      <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.text}</p>
                    <ul className="service-marquee__details" aria-label={`Detalle de ${item.title}`}>
                      {item.items.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="service-context">
          <div className="service-container service-context__grid">
            <div>
              <span className="service-section-kicker">CONTEXTO</span>
              <h2>Que resuelve esta solucion</h2>
            </div>
            <p>{service.context}</p>
          </div>
        </section>

        <section className="service-section service-section--light" id="que-incluye">
          <div className="service-container">
            <div className="service-section-head">
              <span className="service-section-kicker">QUE INCLUYE</span>
              <h2>Componentes pensados para operar como un sistema</h2>
              <p>{service.subtitle}</p>
            </div>

            <div className="service-card-grid">
              {service.includes.map((item, index) => (
                <article className="service-card" key={item.title}>
                  <div className="service-card__icon">
                    <FontAwesomeIcon icon={iconCycle[index % iconCycle.length]} aria-hidden="true" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ul>
                    {item.items.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="service-section service-section--dark" id="como-funciona">
          <div className="service-container">
            <div className="service-section-head service-section-head--dark">
              <span className="service-section-kicker">COMO FUNCIONA</span>
              <h2>Un proceso claro para implementar seguridad real</h2>
            </div>

            <div className="service-steps">
              {service.steps.map((step, index) => (
                <article className="service-step" key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="service-section">
          <div className="service-container service-split">
            <div>
              <span className="service-section-kicker">DIFERENCIALES</span>
              <h2>Por que Albiero</h2>
              <p>
                Cada servicio se integra al ecosistema de seguridad de Albiero:
                tecnologia, monitoreo, personal y respuesta cuando el proyecto lo requiere.
              </p>
            </div>

            <div className="service-differentials">
              {service.differentials.map((item) => (
                <div className="service-differential" key={item}>
                  <FontAwesomeIcon icon={faShieldHalved} aria-hidden="true" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="service-section service-section--light">
          <div className="service-container service-usecases">
            <div>
              <span className="service-section-kicker">APLICACIONES</span>
              <h2>Donde se puede aplicar</h2>
            </div>
            <div className="service-tags">
              {service.useCases.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="service-section">
          <div className="service-container service-split service-split--reverse">
            <div>
              <span className="service-section-kicker">ECOSISTEMA</span>
              <h2>Servicios relacionados</h2>
              <p>
                Estas soluciones pueden combinarse con otros servicios Albiero para
                cubrir mejor el proyecto completo.
              </p>
            </div>
            <div className="service-related">
              {service.related.map((item) => (
                <a href={item.path} key={item.path}>
                  <span>{item.label}</span>
                  <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="service-faq-modern" id="preguntas-frecuentes">
          <div className="service-container service-faq-modern__container">
            <div className="service-faq-modern__header">
              <div className="service-faq-modern__badge">
                <FontAwesomeIcon icon={faQuestionCircle} aria-hidden="true" />
                <span>FAQ</span>
              </div>
              <h2>Preguntas frecuentes</h2>
              <p>
                Respuestas rapidas para entender alcance, implementacion y combinaciones posibles
                de este servicio.
              </p>
            </div>
            <div className="service-faq-modern__list">
              {service.faq.map((item) => (
                <details className="service-faq-modern__item" key={item.q}>
                  <summary>
                    <span>{item.q}</span>
                    <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta-section service-final-cta">
          <div className="final-cta-container">
            <div className="final-cta-badge">
              <FontAwesomeIcon icon={faShieldHalved} className="final-cta-badge-icon" />
              <span>{service.productName}</span>
            </div>
            <div className="final-cta-content">
              <h2 className="final-cta-title">
                Hablemos de tu proyecto <span className="final-cta-gradient">con un asesor.</span>
              </h2>
              <p className="final-cta-description">
                Contanos que necesitás proteger y armamos una propuesta alineada al servicio.
              </p>
              <button className="final-cta-button" onClick={() => openWhatsApp(service)}>
                <span>{service.ctaLabel}</span>
                <FontAwesomeIcon icon={faArrowRight} className="final-cta-button-icon" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
