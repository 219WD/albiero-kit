// CoberturaZonas.jsx
import React, { useRef, useEffect } from "react";
import "./CoberturaZonas.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const zonas = [
  { nombre: "Yerba Buena",           coords: [-26.8167, -65.3167] },
  { nombre: "San Miguel de Tucumán", coords: [-26.8241, -65.2226] },
  { nombre: "Tafí Viejo",            coords: [-26.7333, -65.2667] },
  { nombre: "Tafí del Valle",        coords: [-26.8500, -65.7167] },
  { nombre: "El Mollar",             coords: [-26.9333, -65.7000] },
  { nombre: "Zonas cercanas",        coords: null },
];

const circleZonas = [
  { nombre: "Yerba Buena",           coords: [-26.8167, -65.3167], radio: 5000 },
  { nombre: "San Miguel de Tucumán", coords: [-26.8241, -65.2226], radio: 7000 },
  { nombre: "Tafí Viejo",            coords: [-26.7333, -65.2667], radio: 4000 },
  { nombre: "Tafí del Valle",        coords: [-26.8500, -65.7167], radio: 3500 },
  { nombre: "El Mollar",             coords: [-26.9333, -65.7000], radio: 3000 },
];

const CoberturaZonas = () => {
  const sectionRef  = useRef(null);
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);

  /* Intersection observer — animación entrada */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("cz-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  /* Leaflet init */
  useEffect(() => {
    if (mapInstance.current) return;

    // CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id   = "leaflet-css";
      link.rel  = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    // JS
    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    const L = window.L;

    const map = L.map(mapRef.current, {
      center: [-26.83, -65.38],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    mapInstance.current = map;

    // Tiles oscuros (CartoDB Dark Matter)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, subdomains: "abcd" }
    ).addTo(map);

    // Ícono rojo animado
    const redIcon = L.divIcon({
      className: "",
      html: `<div class="cz-leaflet-pin">
               <div class="cz-leaflet-dot"></div>
               <div class="cz-leaflet-ring"></div>
             </div>`,
      iconSize:   [28, 28],
      iconAnchor: [14, 14],
      popupAnchor:[0, -16],
    });

    // Círculos + markers
    circleZonas.forEach(({ coords, radio, nombre }) => {
      L.circle(coords, {
        radius:      radio,
        color:       "#961C2C",
        fillColor:   "#961C2C",
        fillOpacity: 0.18,
        weight:      1.5,
        opacity:     0.6,
      }).addTo(map);

      L.marker(coords, { icon: redIcon })
        .addTo(map)
        .bindPopup(
          `<div class="cz-popup"><strong>${nombre}</strong></div>`,
          { closeButton: false, offset: [0, -8] }
        );
    });
  };

  return (
    <section className="cz-section" ref={sectionRef} id="cobertura">
      <div className="cz-container">

        {/* Left */}
        <div className="cz-left">
          <div className="cz-badge"><span>COBERTURA</span></div>

          <h2 className="cz-title">
            Presencia<br />
            <span className="cz-title-accent">en Tucumán.</span>
          </h2>

          <p className="cz-desc">
            Trabajamos en distintas zonas de la provincia brindando soluciones
            para hogares, comercios y empresas.
          </p>

          <ul className="cz-list">
            {zonas.map((zona, i) => (
              <li key={zona.nombre} className="cz-list-item" style={{ "--i": i }}>
                <FontAwesomeIcon
                  icon={zona.coords === null ? faLocationDot : faCircleCheck}
                  className={`cz-list-icon${zona.coords === null ? " cz-list-icon--alt" : ""}`}
                  aria-hidden="true"
                />
                <span>{zona.nombre}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — mapa */}
        <div className="cz-right">
          <div className="cz-map-card">
            <div ref={mapRef} className="cz-leaflet-map" />
          </div>

          <div className="cz-floating-badge">
            <FontAwesomeIcon icon={faLocationDot} className="cz-floating-icon" />
            <div>
              <span className="cz-floating-title">Tucumán</span>
              <span className="cz-floating-sub">Cobertura provincial</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoberturaZonas;