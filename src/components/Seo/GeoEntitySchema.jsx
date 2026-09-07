import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { servicePageList } from "../ServiceLanding/servicePagesData";

const SITE_URL = "https://albiero.com.ar";
const LOGO_URL = `${SITE_URL}/logo.png`;
const DEFAULT_IMAGE = LOGO_URL;

const SERVICE_AREAS = [
  "San Miguel de Tucuman",
  "Yerba Buena",
  "Tafi Viejo",
  "Tafi del Valle",
  "El Mollar",
  "Tucuman",
];

const GEO_KEYWORDS = [
  "empresa de seguridad en Tucuman",
  "seguridad electronica en Tucuman",
  "seguridad fisica en Tucuman",
  "monitoreo 24/7 en Tucuman",
  "alarmas monitoreadas en Tucuman",
  "camaras de seguridad en Tucuman",
  "seguridad en San Miguel de Tucuman",
  "seguridad en Yerba Buena",
  "seguridad en Tafi Viejo",
  "seguridad en Tafi del Valle",
  "seguridad en El Mollar",
];

const publicRouteSeo = {
  "/": {
    title: "Albiero Seguridad | Empresa lider en seguridad en Tucuman",
    description:
      "Albiero Seguridad es una empresa tucumana lider en seguridad electronica y fisica: alarmas monitoreadas, camaras, GPS vehicular, seguridad integral y monitoreo 24/7 en Tucuman.",
    serviceName: "Soluciones de seguridad en Tucuman",
    serviceType: "Empresa de seguridad",
    priority: 1,
  },
  "/kit-alarma-camara": {
    title: "Kit Alarma + Camara en Tucuman | Albiero Seguridad",
    description:
      "Kit de alarma y camara con monitoreo 24/7, instalacion profesional y respuesta operativa para casas y comercios de San Miguel, Yerba Buena, Tafi Viejo, Tafi del Valle y El Mollar.",
    serviceName: "Kit Alarma + Camara",
    serviceType: "Alarmas monitoreadas y camaras de seguridad",
  },
  "/alarmas": {
    title: "Alarmas Monitoreadas en Tucuman | Albiero Seguridad",
    description:
      "Sistemas de alarmas monitoreadas con central 24/7, instalacion profesional, equipos en comodato y moviles propios para hogares, comercios y empresas en Tucuman.",
    serviceName: "Alarmas monitoreadas",
    serviceType: "Alarmas de seguridad",
  },
  "/camaras": {
    title: "Camaras de Seguridad en Tucuman | Albiero Seguridad",
    description:
      "Instalacion de camaras de seguridad, videovigilancia, monitoreo y visualizacion desde el celular para casas, comercios, empresas y predios en Tucuman.",
    serviceName: "Camaras de seguridad",
    serviceType: "Videovigilancia",
  },
  "/seguimiento-vehicular": {
    title: "Seguimiento Vehicular GPS en Tucuman | Albiero Seguridad",
    description:
      "Monitoreo GPS para autos, motos, camiones y flotas con ubicacion en tiempo real, historial, alertas y reportes para particulares y empresas de Tucuman.",
    serviceName: "Seguimiento vehicular GPS",
    serviceType: "Monitoreo GPS vehicular",
  },
  "/deteccion-incendios": {
    title: "Deteccion de Incendios en Tucuman | Albiero Seguridad",
    description:
      "Sistemas de deteccion temprana de incendios, sensores, alertas y monitoreo para empresas, comercios, industrias y edificios en Tucuman.",
    serviceName: "Deteccion de incendios",
    serviceType: "Seguridad contra incendios",
  },
  "/seguridad-integral": {
    title: "Seguridad Integral en Tucuman | Albiero Seguridad",
    description:
      "Seguridad integral para empresas, depositos, predios y propiedades particulares con tecnologia, monitoreo, control, guardias y respuesta operativa en Tucuman.",
    serviceName: "Seguridad integral",
    serviceType: "Seguridad electronica y fisica",
  },
  "/promos": {
    title: "Promociones de Seguridad en Tucuman | Albiero Seguridad",
    description:
      "Promociones vigentes de Albiero Seguridad para contratar soluciones de alarmas, camaras, monitoreo y seguridad en Tucuman.",
    robots: "index, follow",
  },
  "/terminos-y-condiciones": {
    title: "Terminos y Condiciones | Albiero Seguridad",
    description:
      "Terminos y condiciones de uso de los servicios digitales, formularios y promociones de Albiero Seguridad.",
    robots: "index, follow",
  },
  "/politica-privacidad": {
    title: "Politica de Privacidad | Albiero Seguridad",
    description:
      "Politica de privacidad de Albiero Seguridad para formularios, comunicaciones, analiticas, campañas y tratamiento de datos.",
    robots: "index, follow",
  },
};

servicePageList.forEach((service) => {
  publicRouteSeo[service.path] = {
    title: service.seo.title,
    description: service.seo.description,
    serviceName: service.productName,
    serviceType: service.eyebrow,
    service,
  };
});

const noIndexPrefixes = [
  "/dashboard",
  "/analiticas",
  "/emailmkt",
  "/usuarios",
  "/leads",
  "/reportes",
  "/informe",
  "/mundial",
];

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

function upsertMeta(selector, attrs) {
  const existing = document.head.querySelector(selector);
  const tag = existing || document.createElement("meta");
  Object.entries(attrs).forEach(([key, value]) => tag.setAttribute(key, value));
  if (!existing) document.head.appendChild(tag);
}

function upsertCanonical(href) {
  const existing = document.head.querySelector('link[rel="canonical"]');
  const tag = existing || document.createElement("link");
  tag.setAttribute("rel", "canonical");
  tag.setAttribute("href", href);
  if (!existing) document.head.appendChild(tag);
}

function setJsonLd(id, graph) {
  const existing = document.getElementById(id);
  const script = existing || document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(graph);
  if (!existing) document.head.appendChild(script);
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}

function getRouteSeo(pathname) {
  const path = normalizePath(pathname);
  if (publicRouteSeo[path]) return { path, ...publicRouteSeo[path] };

  const shouldNoIndex = noIndexPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (shouldNoIndex) {
    return {
      path,
      title: "Albiero Seguridad | Panel interno",
      description: "Herramienta interna de Albiero Seguridad.",
      robots: "noindex, nofollow",
      noSchema: true,
    };
  }

  return {
    path,
    title: "Albiero Seguridad | Empresa lider en seguridad en Tucuman",
    description:
      "Albiero Seguridad brinda soluciones de seguridad electronica, fisica y monitoreo 24/7 en Tucuman.",
    robots: "noindex, follow",
    noSchema: true,
  };
}

function buildLocalBusinessSchema() {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#local-business`,
    name: "Albiero Seguridad",
    alternateName: ["Albiero", "Albiero Sistemas de Seguridad"],
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: "+54 9 3813 52-2339",
    email: "info@albiero.com.ar",
    priceRange: "$$",
    slogan: "Empresa lider en seguridad en Tucuman",
    description:
      "Empresa tucumana lider en seguridad electronica y fisica, con mas de 40 anos de trayectoria, monitoreo 24/7, alarmas, camaras, seguimiento vehicular GPS, control de acceso y soluciones integrales.",
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
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "Place",
      name: area,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Tucuman",
        addressCountry: "AR",
      },
    })),
    knowsAbout: GEO_KEYWORDS,
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
    sameAs: [
      "https://www.instagram.com/albieroseguridad.tuc",
      "https://www.facebook.com/albieroseguridad.tuc",
      "https://www.linkedin.com/company/albiero-seguridad",
    ],
  };
}

function buildRouteGraph(seo) {
  const canonical = `${SITE_URL}${seo.path === "/" ? "/" : seo.path}`;
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Albiero Seguridad",
      inLanguage: "es-AR",
      publisher: { "@id": `${SITE_URL}/#local-business` },
    },
    buildLocalBusinessSchema(),
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: seo.title,
      description: seo.description,
      inLanguage: "es-AR",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#local-business` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: DEFAULT_IMAGE,
      },
      breadcrumb: { "@id": `${canonical}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: `${SITE_URL}/`,
        },
        ...(seo.path === "/"
          ? []
          : [
              {
                "@type": "ListItem",
                position: 2,
                name: seo.serviceName || seo.title.replace(" | Albiero Seguridad", ""),
                item: canonical,
              },
            ]),
      ],
    },
  ];

  if (seo.serviceName) {
    graph.push({
      "@type": "Service",
      "@id": `${canonical}#service`,
      name: seo.serviceName,
      serviceType: seo.serviceType || seo.serviceName,
      url: canonical,
      description: seo.description,
      provider: { "@id": `${SITE_URL}/#local-business` },
      areaServed: SERVICE_AREAS.map((area) => ({ "@type": "Place", name: area })),
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: canonical,
        servicePhone: "+54 9 3813 52-2339",
        availableLanguage: "es-AR",
      },
      hasOfferCatalog: seo.service
        ? {
            "@type": "OfferCatalog",
            name: seo.service.productName,
            itemListElement: seo.service.includes.map((item) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: item.title,
                description: item.text,
              },
            })),
          }
        : undefined,
    });
  }

  if (seo.service?.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonical}#faq`,
      mainEntity: seo.service.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export default function GeoEntitySchema() {
  const location = useLocation();

  useEffect(() => {
    const seo = getRouteSeo(location.pathname);
    const canonical = `${SITE_URL}${seo.path === "/" ? "/" : seo.path}`;
    const robots = seo.robots || "index, follow, max-image-preview:large";

    document.title = seo.title;
    upsertCanonical(canonical);
    upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
    upsertMeta('meta[name="author"]', { name: "author", content: "Albiero Seguridad" });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[name="googlebot"]', { name: "googlebot", content: robots });
    upsertMeta('meta[name="geo.region"]', { name: "geo.region", content: "AR-T" });
    upsertMeta('meta[name="geo.placename"]', { name: "geo.placename", content: "Tucuman" });
    upsertMeta('meta[name="geo.position"]', { name: "geo.position", content: "-26.80830;-65.21760" });
    upsertMeta('meta[name="ICBM"]', { name: "ICBM", content: "-26.80830, -65.21760" });
    upsertMeta('meta[name="keywords"]', {
      name: "keywords",
      content: [...GEO_KEYWORDS, seo.serviceName, seo.serviceType].filter(Boolean).join(", "),
    });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: seo.serviceName ? "website" : "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: DEFAULT_IMAGE });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "es_AR" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Albiero Seguridad" });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:url"]', { name: "twitter:url", content: canonical });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: DEFAULT_IMAGE });

    if (seo.noSchema) {
      removeJsonLd("albiero-route-geo-schema");
      return;
    }

    setJsonLd("albiero-route-geo-schema", buildRouteGraph(seo));
  }, [location.pathname]);

  return null;
}
