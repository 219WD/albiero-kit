// ExpertiseAreasCamaras.jsx
import React, { useState, useRef, useEffect } from "react";
import "./ExpertiseAreasCamaras.css";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ExpertiseAreasCamaras = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRefs = useRef([]);
  const imageRef = useRef(null);

  const casa =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_665,c_fill,f_auto,q_auto/v1772815812/casa_zjuefv.jpg";
  const comercial =
    "https://res.cloudinary.com/dtxdv136u/image/upload/w_665,h_665,c_fill,f_auto,q_auto/v1772815811/comercial_xrbkz2.jpg";

  const expertiseData = [
    {
      id: 1,
      title: "PARA CASA",
      shortTitle: "🏠 Para Casa",
      description:
        "Vigilá tu hogar incluso cuando no estás. Podés ver en tiempo real qué ocurre dentro o fuera de tu propiedad desde tu celular.",
      detailsLabel: "Ideal para:",
      details: [
        "Controlar accesos",
        "Ver quién llega a tu casa",
        "Supervisar la propiedad cuando estás fuera",
      ],
      image: casa,
    },
    {
      id: 2,
      title: "PARA COMERCIO",
      shortTitle: "🏢 Para Comercio",
      description:
        "Controlá lo que ocurre en tu negocio en todo momento. Las cámaras permiten supervisar áreas clave y tener registro visual de cualquier evento.",
      detailsLabel: "Ideal para:",
      details: [
        "Control del local",
        "Supervisión de mercadería",
        "Seguridad fuera de horario",
        "Control operativo del negocio",
      ],
      image: comercial,
    },
  ];

  useEffect(() => {
    if (contentRefs.current[0]) {
      gsap.set(contentRefs.current[0], { height: "auto", opacity: 1 });
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
        { height, opacity: 1, duration: 0.5, ease: "power3.out" }
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

        {/* Izquierda */}
        <div className="expertise-left">
          <h2 className="expertise-main-title">
            SOLUCIONES
            <br />
            A MEDIDA
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
                    icon={activeIndex === index ? faChevronDown : faChevronRight}
                    className="expertise-icon"
                  />
                </button>

                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="expertise-dropdown"
                  style={{
                    height:   index === 0 ? "auto" : 0,
                    opacity:  index === 0 ? 1 : 0,
                    overflow: "hidden",
                  }}
                >
                  <div className="dropdown-content">
                    <h3 className="dropdown-short-title">{item.shortTitle}</h3>
                    <p className="dropdown-description">{item.description}</p>
                    {item.detailsLabel && (
                      <p className="dropdown-details-label">{item.detailsLabel}</p>
                    )}
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

        {/* Derecha */}
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
              src={expertiseData[activeIndex ?? 0].image}
              alt={expertiseData[activeIndex ?? 0].title}
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

export default ExpertiseAreasCamaras;