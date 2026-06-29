export const normalizePhone = (value = "") => value.replace(/[^\d+]/g, "").trim();

export const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

export function validateLeadContact(data = {}) {
  const nombre = String(data.nombre || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const telefono = normalizePhone(data.telefono || "");

  if (nombre.length < 2) {
    return { error: "Dejame tu nombre para poder asesorarte mejor." };
  }

  if (!isValidEmail(email)) {
    return { error: "Ingresá un email válido." };
  }

  if (telefono.replace(/\D/g, "").length < 8) {
    return { error: "Ingresá un número de WhatsApp válido." };
  }

  return { nombre, email, telefono };
}

export function persistLeadContact({ nombre, email, telefono }) {
  window.localStorage.setItem("albiero_lead_nombre", nombre);
  window.localStorage.setItem("albiero_lead_email", email);
  window.localStorage.setItem("albiero_lead_telefono", telefono);
}

export function openWhatsAppLead({ intro, details }) {
  const lines = [
    intro,
    "",
    "Mi consulta:",
    ...details.map(([label, value]) => `${label}: ${value}`),
    "",
    "Quiero recibir informacion sin compromiso.",
  ];

  const message = encodeURIComponent(lines.join("\n"));
  const popup = window.open("", "_blank");

  if (popup) {
    setTimeout(() => {
      popup.location.href = `https://wa.me/5493813522339?text=${message}`;
    }, 450);
  } else {
    window.location.href = `https://wa.me/5493813522339?text=${message}`;
  }
}
