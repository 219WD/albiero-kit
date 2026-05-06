const CAPI_ENDPOINT = import.meta.env.VITE_META_CAPI_ENDPOINT;

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

export const sendMetaEvent = (eventType, eventName, params = {}, options = {}) => {
  if (typeof window === "undefined") return undefined;

  const eventId = options.eventId || createEventId(eventName);

  if (typeof window.fbq === "function") {
    window.fbq(eventType, eventName, params, { eventID: eventId });
  } else if (options.warnPrefix) {
    console.warn(`[${options.warnPrefix}] fbq no esta disponible, se envia por CAPI`);
  }

  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_source_url: window.location.href,
    custom_data: params,
    fbp: readCookie("_fbp"),
    fbc: getFbc(),
  };

  if (CAPI_ENDPOINT) {
    fetch(CAPI_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      keepalive: true,
      body: JSON.stringify(payload),
    }).catch((error) => {
      console.warn("[Meta CAPI] No se pudo enviar el evento", eventName, error);
    });
  }

  return eventId;
};
