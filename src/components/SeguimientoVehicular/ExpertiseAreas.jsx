// ExpertiseAreas.jsx
import React, { useState, useRef, useEffect } from "react";
import "./ExpertiseAreas.css";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ExpertiseAreas = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRefs = useRef([]);
  const imageRef = useRef(null);

  const movil =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1773093433/particular_pnrltn.jpg";
  const comercial =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1773093429/empresass_iu7zxn.jpg";
  const equipo =
    "https://res.cloudinary.com/dtxdv136u/image/upload/v1773093431/flota_wxjqi6.jpg";

  const expertiseData = [
    {
      id: 1,
      title: "PARTICULARES",
      shortTitle: "Para motos o autos particulares",
      description:
        "Tené control total de tu vehículo. Podés ver su ubicación en tiempo real, revisar recorridos y recibir alertas si ocurre algo fuera de lo normal.",
      details: [
        "Ubicación en tiempo real desde tu celular.",
        "Historial de recorridos completo.",
        "Alertas ante movimientos sospechosos.",
      ],
      image: movil,
    },
    {
      id: 2,
      title: "EMPRESAS",
      shortTitle: "Para empresas con vehículos",
      description:
        "Controlá cómo se utilizan los vehículos de tu empresa. Con información clara para mejorar la operación y reducir costos.",
      details: [
        "Evitá desvíos y uso fuera de horario.",
        "Detectá recorridos ineficientes.",
        "Reportes de conducción y zonas recorridas.",
      ],
      image: comercial,
    },
    {
      id: 3,
      title: "FLOTAS",
      shortTitle: "Para flotas de trabajo",
      description:
        "Gestioná todos tus vehículos desde una misma plataforma. Mejor control = mayor eficiencia.",
      details: [
        "Optimización de rutas en tiempo real.",
        "Historial de paradas y tiempos.",
        "Monitoreo completo de toda la operación.",
      ],
      image: equipo,
    },
  ];

  useEffect(() => {
    if (contentRefs.current[0]) {
      const firstContent = contentRefs.current[0];
      gsap.set(firstContent, { height: "auto", opacity: 1 });
      setActiveIndex(0);
    }
  }, []);

  const handleToggle = (index) => {
    const content = contentRefs.current[index];
    const isOpening = activeIndex !== index;

    if (activeIndex !== null && activeIndex !== index) {
      const previousContent = contentRefs.current[activeIndex];
      gsap.to(previousContent, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    if (isOpening) {
      gsap.set(content, { height: "auto" });
      const height = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: height,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      );

      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(imageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });

      setActiveIndex(index);
    } else {
      return;
    }
  };

  return (
    <section className="expertise-areas-container">
      <div className="expertise-content" id="soluciones">
        {/* Lado Izquierdo - Opciones */}
        <div className="expertise-left">
          <h2 className="expertise-main-title">
            SOLUCIONES
            <br />A MEDIDA
          </h2>

          <div className="expertise-options">
            {expertiseData.map((item, index) => (
              <div key={item.id} className="expertise-option">
                <button
                  className={`expertise-button ${activeIndex === index ? "active" : ""}`}
                  onClick={() => handleToggle(index)}
                >
                  <span className="expertise-title">{item.title}</span>
                  <FontAwesomeIcon
                    icon={
                      activeIndex === index ? faChevronDown : faChevronRight
                    }
                    className="expertise-icon"
                  />
                </button>

                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="expertise-dropdown"
                  style={{
                    height: index === 0 ? "auto" : 0,
                    opacity: index === 0 ? 1 : 0,
                    overflow: "hidden",
                  }}
                >
                  <div className="dropdown-content">
                    <h3 className="dropdown-short-title">{item.shortTitle}</h3>
                    <p className="dropdown-description">{item.description}</p>
                    <ul className="dropdown-details">
                      {item.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Derecho - Imagen + Texto */}
        <div className="expertise-right">
          <div className="expertise-header-text">
            <p className="expertise-subtitle">
              MÁS DE 40 AÑOS DE EXPERIENCIA EN
              <br />
              SEGURIDAD EN TUCUMÁN
            </p>
          </div>

          <div ref={imageRef} className="expertise-image-container">
            <img
              src={
                activeIndex !== null
                  ? expertiseData[activeIndex].image
                  : expertiseData[0].image
              }
              alt={
                activeIndex !== null
                  ? expertiseData[activeIndex].title
                  : "Expertise"
              }
              width="665"
              height="665"
              className="expertise-image"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseAreas;