import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./FloatingWhatsApp.css";

const WHATSAPP_URL =
  "https://wa.me/5493812228265?text=Hola%2C%20quiero%20recibir%20asesoramiento%20de%20Albiero%20Seguridad";

const PRIVATE_PATHS = [
  "/dashboard",
  "/analiticas",
  "/emailmkt",
  "/usuarios",
  "/promos",
  "/leads",
  "/reportes",
  "/informe",
  "/mundial",
];

function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const isPrivateArea = PRIVATE_PATHS.some(
    (privatePath) => pathname === privatePath || pathname.startsWith(`${privatePath}/`),
  );

  if (isPrivateArea) return null;

  return (
    <a
      className="floating-whatsapp"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      title="Escribinos por WhatsApp"
    >
      <span className="floating-whatsapp__tooltip">Escribinos por WhatsApp</span>
      <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
    </a>
  );
}

export default FloatingWhatsApp;
