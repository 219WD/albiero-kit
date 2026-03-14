import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

// ── NUEVA LÍNEA 1: importar el componente de captación ──
import EmailCapture from "./EmailCapture/EmailCapture.jsx";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // ── NUEVA LÍNEA 2: wrapper Fragment ──
    <>
      {/* ── NUEVA LÍNEA 3: newsletter bar + modal automático ── */}
      <EmailCapture />

      {/* Todo lo que sigue es idéntico a tu Footer.jsx original */}
      <footer className="footer">
        <div className="footer-main" id="contacto">
          <div className="footer-container">

            {/* Columna 1 - Logo y descripción */}
            <div className="footer-col footer-col-logo">
              <div className="footer-logo">
                <img
                  src={logo}
                  alt="Albiero Seguridad"
                  width="175"
                  height="147"
                  className="footer-logo-img"
                />
              </div>
              <h3 className="footer-company">Albiero Seguridad</h3>
              <p className="footer-description">
                Más de 40 años liderando la seguridad de Tucumán.
              </p>
            </div>

            {/* Columna 2 - Contacto */}
            <div className="footer-col">
              <h4 className="footer-title">Contacto</h4>
              <div className="footer-contact-item">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="footer-contact-icon"
                  aria-hidden="true"
                />
                <a href="tel:+543814531300" className="footer-contact-link">
                  0381 453 1300
                </a>
              </div>
              <div className="footer-contact-item">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="footer-contact-icon"
                  aria-hidden="true"
                />
                <a
                  href="mailto:info@albiero.com.ar"
                  className="footer-contact-link"
                >
                  info@albiero.com.ar
                </a>
              </div>
            </div>

            {/* Columna 3 - Direcciones */}
            <div className="footer-col">
              <h4 className="footer-title">Direcciones</h4>
              <div className="footer-address-item">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="footer-address-icon"
                  aria-hidden="true"
                />
                <span>Catamarca 479 - San Miguel de Tucumán</span>
              </div>
              <div className="footer-address-item">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="footer-address-icon"
                  aria-hidden="true"
                />
                <span>Av. Aconquija 364 - Yerba Buena</span>
              </div>
              <div className="footer-address-item">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="footer-address-icon"
                  aria-hidden="true"
                />
                <span>Av. Calchaquí S/N - Tafí del Valle</span>
              </div>
            </div>

            {/* Columna 4 - Redes Sociales */}
            <div className="footer-col">
              <h4 className="footer-title">Seguinos</h4>
              <div className="footer-social">
                <a
                  href="https://instagram.com/albieroseguridad.tuc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Seguinos en Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
                </a>
                <a
                  href="https://wa.me/5493813522339?text=Quiero%20asesoramiento%20por%20el%20Kit%20de%20Alarma%20y%20Cámara"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Contactanos por WhatsApp"
                >
                  <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
                </a>
                <a
                  href="https://facebook.com/albieroseguridad.tuc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Seguinos en Facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} aria-hidden="true" />
                </a>
                <a
                  href="https://linkedin.com/company/albiero-sistemas-de-seguridad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label="Seguinos en LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} aria-hidden="true" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Barra inferior de copyright */}
        <div className="footer-bottom">
          <div className="footer-container">
            <p className="footer-copyright">
              © Copyright {currentYear} Albiero Seguridad. Todos los derechos
              reservados.
            </p>
          </div>
        </div>

        {/* Barra de créditos */}
        <div className="footer-credits">
          <p className="footer-credits-text">
            Página web hecha con ♥ por 219Labs
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;