const CAPI_ENDPOINT = import.meta.env.VITE_META_CAPI_ENDPOINT;
const META_TEST_EVENT_CODE = import.meta.env.VITE_META_TEST_EVENT_CODE;

const readCookie = (name) => {
  if (typeof document === "undefined") return undefined;

  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
};

const getFbc = () => {
  const cookieValue = readCookie("_fbc");
  if (cookieValue) return decodeURIComponent(cookieValue);

  if (typeof window === "undefined") return undefined;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
};

const createEventId = (eventName) => {
  const randomPart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${eventName}.${randomPart}`;
};

const getMetaTestEventCode = () => {
  if (typeof window === "undefined") return undefined;

  const urlCode = new URLSearchParams(window.location.search).get("test_event_code");
  if (urlCode) {
    sessionStorage.setItem("albiero_meta_test_event_code", urlCode);
    return urlCode;
  }

  return sessionStorage.getItem("albiero_meta_test_event_code") || META_TEST_EVENT_CODE || undefined;
};

const normalizeEmail = (value = "") => {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};

const normalizeName = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getMetaAdvancedMatchingData = (extraData = {}) => {
  if (typeof window === "undefined") return {};

  const email = normalizeEmail(extraData.email || localStorage.getItem("albiero_email"));
  const nombre = normalizeName(extraData.nombre || localStorage.getItem("albiero_nombre"));
  const nameParts = nombre.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return {
    ...(email ? { em: email } : {}),
    ...(firstName ? { fn: firstName } : {}),
    ...(lastName ? { ln: lastName } : {}),
  };
};

export const setMetaAdvancedMatching = (data = {}) => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;

  const advancedMatching = getMetaAdvancedMatchingData(data);
  if (Object.keys(advancedMatching).length === 0) return;

  window.fbq("init", "1238813565123149", advancedMatching);
};

const sendCapiPayload = (payload, eventName) => {
  if (!CAPI_ENDPOINT) return;

  const body = JSON.stringify(payload);

  if (payload.test_event_code) {
    fetch(CAPI_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      keepalive: true,
      body,
    })
      .then((response) => {
        if (!response.ok) {
          console.warn("[Meta CAPI] El backend rechazo el evento de prueba", eventName, response.status);
        }
      })
      .catch((error) => {
        console.warn("[Meta CAPI] No se pudo enviar el evento de prueba", eventName, error);
      });
    return;
  }

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "text/plain" });
    const queued = navigator.sendBeacon(CAPI_ENDPOINT, blob);

    if (queued) return;
  }

  fetch(CAPI_ENDPOINT, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "text/plain" },
    keepalive: true,
    body,
  }).catch((error) => {
    console.warn("[Meta CAPI] No se pudo enviar el evento", eventName, error);
  });
};

const needsValueCurrency = (eventName = "") => {
  const name = String(eventName || "");
  return name.includes("Paso3_") || name === "Paso3_SistemaSeleccionado" || name.endsWith("FormularioEnviado_WhatsApp");
};

const normalizeValueCurrency = (eventName, params = {}) => {
  if (!needsValueCurrency(eventName)) return params;

  const value = Number(params.value ?? params.valor_lead);
  const currency = String(params.currency || params.currency_code || "").trim().toUpperCase();

  return {
    ...params,
    value: Number.isFinite(value) && value > 0 ? value : 1,
    valor_lead: Number.isFinite(value) && value > 0 ? value : 1,
    currency: /^[A-Z]{3}$/.test(currency) ? currency : "ARS",
  };
};

const getStoredLeadData = (eventName) => {
  if (!String(eventName || "").endsWith("FormularioEnviado_WhatsApp")) {
    return {};
  }

  return {
    email: localStorage.getItem("albiero_email") || "-",
    nombre: localStorage.getItem("albiero_nombre") || "-",
    codigo: localStorage.getItem("albiero_codigo") || "-",
    bienvenida_enviada: localStorage.getItem("albiero_subscribed") ? "Si" : "",
  };
};

export const sendMetaEvent = (eventType, eventName, params = {}, options = {}) => {
  if (typeof window === "undefined") return undefined;

  const eventId = options.eventId || createEventId(eventName);
  const metaParams = normalizeValueCurrency(eventName, params);
  const advancedMatching = getMetaAdvancedMatchingData(params);

  if (typeof window.fbq === "function") {
    window.fbq(eventType, eventName, metaParams, { eventID: eventId });
  } else if (options.warnPrefix) {
    console.warn(`[${options.warnPrefix}] fbq no esta disponible, se envia por CAPI`);
  }

  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href,
    custom_data: {
      ...metaParams,
      ...getStoredLeadData(eventName),
    },
    user_data: advancedMatching,
    test_event_code: getMetaTestEventCode(),
    fbp: readCookie("_fbp"),
    fbc: getFbc(),
  };

  sendCapiPayload(payload, eventName);

  return eventId;
};
