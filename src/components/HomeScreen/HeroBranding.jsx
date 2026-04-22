import { useEffect, useRef } from "react";
import "./HeroBranding.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faVideo,
  faLocationDot,
  faChevronDown,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { gsap } from "gsap";

const VIDEO_MP4 =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto/v1772819547/video-bg-compr_a6c1oj.mp4";
const VIDEO_WEBM =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,vc_vp9/v1772819547/video-bg-compr_a6c1oj.webm";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dtxdv136u/video/upload/q_auto,f_auto,w_1280,so_0/v1772819547/video-bg-compr_a6c1oj.jpg";

const HeroBranding = () => {
  const tituloRef = useRef(null);
  const subRef = useRef(null);
  const descRef = useRef(null);
  const pillsRef = useRef(null);
  const ctasRef = useRef(null);
  const breadRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        tituloRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
      )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5",
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          pillsRef.current?.children
            ? Array.from(pillsRef.current.children)
            : [],
          { opacity: 0, y: 16, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12 },
          "-=0.3",
        )
        .fromTo(
          ctasRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2",
        )
        .fromTo(
          breadRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.1",
        );
    });

    return () => ctx.revert();
  }, []);

  const handleVerSoluciones = () => {
    const el = document.getElementById("servicios");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleWhatsApp = () => {
    const msg =
      "Hola! Quiero solicitar asesoramiento sobre las soluciones de seguridad de Albiero.";
    window.open(
      `https://wa.me/5493813522339?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <section className="hb-section">
      {/* ── Fondo de video ── */}
      <div className="hb-video-wrap">
        <img
          src={VIDEO_POSTER}
          alt=""
          aria-hidden="true"
          className="hb-poster"
          width="1280"
          height="720"
          fetchPriority="high"
        />
        <video
          className="hb-video"
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

      <div className="hb-overlay" />

      {/* ── Contenido ── */}
      <div className="hb-contenedor">
        <div className="hb-inner">
          {/* Pills de servicios */}
          <div className="hb-pills" ref={pillsRef}>
            <span className="hb-pill">
              <FontAwesomeIcon icon={faShield} /> Alarmas
            </span>
            <span className="hb-pill">
              <FontAwesomeIcon icon={faVideo} /> Cámaras
            </span>
            <span className="hb-pill">
              <FontAwesomeIcon icon={faLocationDot} /> GPS Vehicular
            </span>
          </div>

          {/* Titular */}
          <h1 className="hb-titulo" ref={tituloRef}>
            Más de 40 años ofreciendo
            <br />
            <span className="hb-titulo-accent">soluciones de seguridad</span>
          </h1>

          {/* Subtítulo */}
          <p className="hb-subtitulo" ref={subRef}>
            Soluciones integrales en seguridad electrónica y física, con
            monitoreo y protección 24/7.
          </p>

          {/* Descripción */}
          <p className="hb-desc" ref={descRef}>
            Tecnología, experiencia y guardias de asistencia propios cuando más se necesita.
          </p>

          {/* CTAs */}
          <div className="hb-ctas" ref={ctasRef}>
            <button className="hb-cta-primary" onClick={handleVerSoluciones}>
              Ver soluciones de seguridad
              <FontAwesomeIcon icon={faArrowRight} className="hb-cta-icon" />
            </button>
            <button className="hb-cta-secondary" onClick={handleWhatsApp}>
              <FontAwesomeIcon icon={faWhatsapp} className="hb-cta-icon" />
              Solicitar asesoramiento
            </button>
          </div>

          {/* Subtexto confianza */}
          <p className="hb-trust" ref={breadRef}>
            <span>40 años de trayectoria</span>
            <span className="hb-trust-sep" aria-hidden="true">
              •
            </span>
            <span>Tecnología profesional</span>
            <span className="hb-trust-sep" aria-hidden="true">
              •
            </span>
            <span>Cobertura en Tucumán</span>
          </p>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hb-scroll" ref={scrollRef}>
        <button
          className="hb-scroll-btn"
          aria-label="Ver más información"
          onClick={handleVerSoluciones}
        >
          <span>Más Información</span>
          <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default HeroBranding;
