// DiferencialAlbiero.jsx
import React, { useRef, useEffect } from "react";
import "./DiferencialAlbiero.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMedal,
  faMicrochip,
  faSliders,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

const items = [
  {
    id: 1,
    icon: faMedal,
    number: "01",
    title: "Experiencia comprobada",
    description:
      "Más de 40 años brindando soluciones de seguridad en Tucumán.",
  },
  {
    id: 2,
    icon: faMicrochip,
    number: "02",
    title: "Tecnología profesional",
    description:
      "Trabajamos con equipos confiables y sistemas actualizados.",
  },
  {
    id: 3,
    icon: faSliders,
    number: "03",
    title: "Soluciones a medida",
    description:
      "Cada cliente tiene necesidades diferentes. Diseñamos sistemas adaptados a cada caso.",
  },
  {
    id: 4,
    icon: faHeadset,
    number: "04",
    title: "Soporte y asesoramiento",
    description:
      "Nuestro equipo acompaña cada proyecto desde la planificación hasta la instalación.",
  },
];

const DiferencialAlbiero = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("da-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section className="da-section" ref={sectionRef} id="por-que-albiero">

      {/* Left column — sticky heading */}
      <div className="da-left">
        <div className="da-badge">
          <span>DIFERENCIAL</span>
        </div>
        <h2 className="da-title">
          Por qué<br />
          <span className="da-title-accent">elegir Albiero.</span>
        </h2>
        <div className="da-rule" aria-hidden="true" />
        <p className="da-tagline">
          40 años de trayectoria respaldan cada proyecto.
        </p>

        {/* Autoridad block */}
        <div className="da-autoridad">
          <h3 className="da-autoridad-title">
            Cuatro décadas dedicadas a la seguridad.
          </h3>
          <p className="da-autoridad-text">
            Desde hace más de 40 años trabajamos para proteger lo que más
            importa. Albiero nació con un objetivo claro: brindar soluciones de
            seguridad confiables para hogares, comercios y empresas de Tucumán.
          </p>
          <p className="da-autoridad-text">
            A lo largo del tiempo incorporamos nuevas tecnologías, ampliamos
            nuestros servicios y desarrollamos soluciones integrales que hoy
            permiten proteger propiedades, vehículos y operaciones completas.
          </p>
          <p className="da-autoridad-closing">
            Experiencia, tecnología y compromiso en cada instalación.
          </p>
        </div>
      </div>

      {/* Right column — items */}
      <div className="da-right">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="da-item"
            style={{ "--i": i }}
          >
            {/* Number */}
            <span className="da-item-number" aria-hidden="true">
              {item.number}
            </span>

            {/* Icon */}
            <div className="da-item-icon">
              <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
            </div>

            {/* Text */}
            <div className="da-item-body">
              <h3 className="da-item-title">{item.title}</h3>
              <p className="da-item-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default DiferencialAlbiero;