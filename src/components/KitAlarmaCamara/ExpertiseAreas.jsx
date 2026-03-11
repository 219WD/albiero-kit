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
  const [activeIndex, setActiveIndex] = useState(0); // Inicia abierto el primero (0)
  const contentRefs = useRef([]);
  const imageRef = useRef(null);
  const casa =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_665,c_fill,f_auto,q_auto/v1772815812/casa_zjuefv.jpg";
  const comercial =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_665,c_fill,f_auto,q_auto/v1772815811/comercial_xrbkz2.jpg";

  // Actualizado con solo 2 opciones y los textos personalizados
  const expertiseData = [
    {
      id: 1,
      title: "RESIDENCIAL",
      shortTitle: "Para Casa",
      description:
        "Dormí tranquilo aunque oscurezca antes. Protegé a tu familia, incluso cuando no estás.",
      details: [
        "Alertas en tiempo real.",
        "Botón de pánico.",
        "Respuesta inmediata.",
      ],
      image: casa,
    },
    {
      id: 2,
      title: "COMERCIO",
      shortTitle: "Para Comercio",
      description:
        "Reducí riesgo de robo fuera de horario. Protegé mercadería y equipamiento.",
      details: [
        "Monitoreo activo nocturno.",
        "Control total desde tu celular.",
        "Respuesta rápida ante cualquier evento.",
      ],
      image: comercial,
    },
  ];

  useEffect(() => {
    // Asegurar que el primer dropdown esté abierto al montar el componente
    if (contentRefs.current[0]) {
      const firstContent = contentRefs.current[0];
      gsap.set(firstContent, { height: "auto", opacity: 1 });
      setActiveIndex(0);
    }
  }, []);

  const handleToggle = (index) => {
    const content = contentRefs.current[index];
    const isOpening = activeIndex !== index;

    // Si hay uno activo y no es el mismo, cerrarlo
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
      // Abrir el nuevo
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

      // Animar cambio de imagen
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
      // Si es el mismo, no hacemos nada para mantener al menos uno abierto
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
