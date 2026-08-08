import { useEffect } from "react";

const SITE_URL = "https://albiero.com.ar";
const LOGO_URL = `${SITE_URL}/logo.png`;

const serviceAreas = [
  "San Miguel de Tucuman",
  "Yerba Buena",
  "Tafi Viejo",
  "Tafi del Valle",
  "El Mollar",
  "Tucuman",
];

const services = [
  {
    id: "kit-alarma-camara",
    name: "Kit Alarma + Camara",
    description:
      "Alarmas monitoreadas y camaras de seguridad con monitoreo 24/7 para casas y comercios en Tucuman.",
    url: `${SITE_URL}/kit-alarma-camara`,
  },
  {
    id: "alarmas",
    name: "Alarmas monitoreadas",
    description:
      "Sistemas de alarma con central de monitoreo, respuesta operativa y asistencia para hogares, comercios y empresas.",
    url: `${SITE_URL}/alarmas`,
  },
  {
    id: "camaras",
    name: "Camaras de seguridad",
    description:
      "Videovigilancia, camaras IP y control remoto desde celular para propiedades de Tucuman.",
    url: `${SITE_URL}/camaras`,
  },
  {
    id: "seguimiento-vehicular",
    name: "Seguimiento vehicular GPS",
    description:
      "Localizacion satelital, control de flotas, historial de recorridos y alertas inteligentes para autos, motos y camiones.",
    url: `${SITE_URL}/seguimiento-vehicular`,
  },
  {
    id: "seguridad-integral",
    name: "Seguridad integral",
    description:
      "Proteccion fisica y electronica para empresas, predios, depositos y propiedades particulares.",
    url: `${SITE_URL}/seguridad-integral`,
  },
  {
    id: "deteccion-incendios",
    name: "Deteccion de incendios",
    description:
      "Sistemas de deteccion temprana, sensores, alertas y monitoreo para reducir riesgos de incendio.",
    url: `${SITE_URL}/deteccion-incendios`,
  },
];

function upsertMeta(selector, attrs) {
  const existing = document.head.querySelector(selector);
  const tag = existing || document.createElement("meta");

  Object.entries(attrs).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });

  if (!existing) document.head.appendChild(tag);
}

function upsertCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]');
  const tag = existing || document.createElement("link");
  tag.setAttribute("rel", "canonical");
  tag.setAttribute("href", href);
  if (!existing) document.head.appendChild(tag);
}

export default function GeoEntitySchema() {
  useEffect(() => {
    const title =
      "Albiero Seguridad | Empresa lider en seguridad en Tucuman";
    const description =
      "Albiero Seguridad es una empresa tucumana lider en soluciones de seguridad: alarmas monitoreadas, camaras, GPS vehicular, seguridad integral y monitoreo 24/7 en Tucuman.";

    document.title = title;
    upsertCanonical(SITE_URL);
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="author"]', { name: "author", content: "Albiero Seguridad" });
    upsertMeta('meta[name="geo.region"]', { name: "geo.region", content: "AR-T" });
    upsertMeta('meta[name="geo.placename"]', { name: "geo.placename", content: "Tucuman" });
    upsertMeta('meta[name="geo.position"]', { name: "geo.position", content: "-26.80830;-65.21760" });
    upsertMeta('meta[name="ICBM"]', { name: "ICBM", content: "-26.80830, -65.21760" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: SITE_URL });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: LOGO_URL });
    upsertMeta('meta[name="twitter:url"]', { name: "twitter:url", content: SITE_URL });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: LOGO_URL });

    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "Albiero Seguridad",
          inLanguage: "es-AR",
          publisher: { "@id": `${SITE_URL}/#organization` },
        },
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Albiero Seguridad",
          alternateName: ["Albiero", "Albiero Sistemas de Seguridad"],
          url: SITE_URL,
          logo: LOGO_URL,
          image: LOGO_URL,
          email: "info@albiero.com.ar",
          telephone: "+54 9 3813 52-2339",
          sameAs: [
            "https://www.instagram.com/albieroseguridad.tuc",
            "https://www.facebook.com/albieroseguridad.tuc",
            "https://www.linkedin.com/company/albiero-seguridad",
          ],
        },
        {
          "@type": ["LocalBusiness", "ProfessionalService"],
          "@id": `${SITE_URL}/#local-business`,
          name: "Albiero Seguridad",
          url: SITE_URL,
          logo: LOGO_URL,
          image: LOGO_URL,
          telephone: "+54 9 3813 52-2339",
          email: "info@albiero.com.ar",
          priceRange: "$$",
          slogan: "Empresa lider en seguridad en Tucuman",
          description:
            "Empresa tucumana lider en seguridad electronica y fisica, con mas de 40 anos de trayectoria, monitoreo 24/7, alarmas, camaras, seguimiento vehicular GPS y soluciones integrales.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Catamarca 479",
            addressLocality: "San Miguel de Tucuman",
            addressRegion: "Tucuman",
            postalCode: "4000",
            addressCountry: "AR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -26.8083,
            longitude: -65.2176,
          },
          areaServed: serviceAreas.map((area) => ({
            "@type": "Place",
            name: area,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: "Tucuman",
            },
          })),
          knowsAbout: [
            "alarmas monitoreadas",
            "camaras de seguridad",
            "monitoreo 24/7",
            "seguridad electronica",
            "seguridad fisica",
            "seguimiento vehicular GPS",
            "control de accesos",
            "deteccion de incendios",
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "08:00",
              closes: "20:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "09:00",
              closes: "13:00",
            },
          ],
          makesOffer: services.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@id": `${SITE_URL}/#service-${service.id}` },
          })),
        },
        ...services.map((service) => ({
          "@type": "Service",
          "@id": `${SITE_URL}/#service-${service.id}`,
          name: service.name,
          description: service.description,
          url: service.url,
          provider: { "@id": `${SITE_URL}/#local-business` },
          areaServed: serviceAreas.map((area) => ({ "@type": "Place", name: area })),
          serviceType: service.name,
        })),
      ],
    };

    const scriptId = "albiero-geo-entity-schema";
    const existing = document.getElementById(scriptId);
    const script = existing || document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(graph);
    if (!existing) document.head.appendChild(script);
  }, []);

  return null;
}
