import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEnvelope,
  faMapMarkerAlt,
  faTriangleExclamation,
  faShieldHalved,
  faLock,
  faBan,
  faUserShield,
  faServer,
  faGlobe,
  faClockRotateLeft,
  faSliders,
  faChild,
  faBell,
  faCamera,
  faMicrophone,
  faWifi,
  faHardDrive,
} from "@fortawesome/free-solid-svg-icons";
import "./PoliticaPrivacidad.css";
import FooterDos from "../components/FooterDos";
import LogoGrande from "../assets/logo-grande.png";

const PoliticaPrivacidad = () => {
  return (
    <div className="tyc-root">

      {/* Header */}
      <div className="tyc-header">
        <img src="/logo.png" alt="Logo Albiero Seguridad" className="tyc-header-logo" />
        <span className="modal-title">Política de Privacidad</span>
      </div>

      <div className="messages-container">
        <div className="messages-list">

          {/* Hero */}
          <div className="tyc-hero">
            <img src={LogoGrande} alt="Albiero Seguridad" className="tyc-hero-logo" />
            <div className="tyc-hero-text">
              <p className="tyc-hero-title">Albiero Seguridad</p>
              <p className="tyc-hero-subtitle">
                Política de privacidad de la aplicación de videoportero QR.
                Conocé cómo protegemos tus datos personales.
              </p>
            </div>
          </div>

          {/* Fecha */}
          <div className="tyc-date-badge">
            <span>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 6 }} />
              Última actualización: abril de 2026
            </span>
          </div>

          {/* Sección 1 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">1</div>
              <p className="tyc-section-title">Información general</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email">
                En Albiero Seguridad respetamos tu privacidad y nos comprometemos a proteger los datos
                personales que nos confiás al utilizar nuestra aplicación de videoportero QR.
              </p>
              <p className="guest-info-email" style={{ marginTop: 8 }}>
                La aplicación permite gestionar accesos, mensajería y videollamadas asociadas a un inmueble.
                Esta política describe qué información recopilamos, cómo la utilizamos, con quién la
                compartimos y cuáles son tus derechos.
              </p>
              <div className="tyc-note">
                <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 8, color: "#7D5A00" }} />
                El uso de la aplicación implica la aceptación de esta política.
              </div>
            </div>
          </div>

          {/* Sección 2 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">2</div>
              <p className="tyc-section-title">Responsable del tratamiento</p>
            </div>
            <div className="tyc-section-body">
              <div className="tyc-contact-row" style={{ marginBottom: 8 }}>
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: "#7D1522", marginRight: 10, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}><strong>Razón social:</strong> Albiero Seguridad</p>
              </div>
              <div className="tyc-contact-row" style={{ marginBottom: 8 }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: "#7D1522", marginRight: 10, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}><strong>País:</strong> Argentina</p>
              </div>
              <div className="tyc-contact-row">
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "#7D1522", marginRight: 10, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}>privacidad@albieroseguridad.com.ar</p>
              </div>
            </div>
          </div>

          {/* Sección 3 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">3</div>
              <p className="tyc-section-title">Base legal del tratamiento</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>Tratamos tus datos personales conforme a:</p>
              {[
                "Tu consentimiento al utilizar la aplicación",
                "La ejecución del servicio solicitado (videoportero, accesos y comunicación)",
                "El cumplimiento de obligaciones legales aplicables",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 10 }}>
                De acuerdo con la Ley N.º 25.326 de Protección de Datos Personales de la República Argentina.
              </p>
            </div>
          </div>

          {/* Sección 4 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">4</div>
              <p className="tyc-section-title">Datos que recopilamos</p>
            </div>
            <div className="tyc-section-body">

              <p className="tyc-subsection-title">Datos personales</p>
              {["Nombre y apellido", "Correo electrónico", "Número de teléfono", "Dirección del inmueble"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}

              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Datos de uso y acceso</p>
              {["Registros de acceso (fecha, hora, tipo de evento)", "Logs de actividad dentro de la aplicación"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}

              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Mensajería</p>
              {[
                "Contenido de mensajes enviados dentro de la plataforma",
                "Metadatos de mensajes (fecha, hora, participantes)",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 6 }}>
                Estos datos se almacenan para permitir el funcionamiento del sistema de comunicación.
              </p>

              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Videollamadas</p>
              <div className="tyc-note" style={{ marginBottom: 8 }}>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: 8, color: "#7D5A00" }} />
                No almacenamos audio, video ni imágenes de las llamadas.
              </div>
              {["Duración de la llamada", "Estado (atendida, rechazada, no respondida)"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}

              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Datos técnicos</p>
              {["Modelo de dispositivo", "Sistema operativo", "Identificador de instalación"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Sección 5 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">5</div>
              <p className="tyc-section-title">Finalidad del tratamiento</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>Utilizamos los datos exclusivamente para:</p>
              {[
                "Gestionar accesos mediante códigos QR",
                "Autenticar usuarios autorizados",
                "Permitir mensajería entre usuarios del sistema",
                "Gestionar videollamadas del videoportero",
                "Registrar eventos de acceso y comunicación",
                "Enviar notificaciones push",
                "Brindar soporte técnico",
                "Mejorar la seguridad y funcionamiento del sistema",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}

              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Restricciones de uso</p>
              <p className="guest-info-email" style={{ marginBottom: 8 }}>Tus datos:</p>
              {[
                "No se venden",
                "No se alquilan",
                "No se utilizan para publicidad de terceros",
                "No se usan para perfilado comercial",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-danger">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 6 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">6</div>
              <p className="tyc-section-title">Datos sensibles y control del usuario</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                Dado que el servicio involucra accesos físicos a inmuebles:
              </p>
              {[
                "La información se utiliza exclusivamente para control de acceso y comunicación",
                "No se realiza vigilancia activa ni monitoreo fuera del uso del sistema",
                "Las videollamadas son en tiempo real y no se graban",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>El usuario controla:</p>
              {["Uso de mensajería", "Permisos de acceso", "Configuración de notificaciones"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 7 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">7</div>
              <p className="tyc-section-title">Compartición de datos</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                No compartimos datos personales con terceros, excepto en los siguientes casos:
              </p>
              <p className="tyc-subsection-title">Proveedores tecnológicos</p>
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                Utilizamos servicios de infraestructura necesarios para operar la aplicación. Estos proveedores:
              </p>
              {[
                "Solo procesan datos bajo nuestras instrucciones",
                "Están obligados a mantener confidencialidad",
                "No pueden usar los datos para fines propios",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Requerimientos legales</p>
              <p className="guest-info-email">
                Podremos divulgar información si es requerido por autoridad competente.
              </p>
            </div>
          </div>

          {/* Sección 8 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">8</div>
              <p className="tyc-section-title">Transferencias internacionales</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email">
                Los datos pueden ser almacenados o procesados en servidores ubicados fuera de Argentina.
                En estos casos, garantizamos que los proveedores cumplen con estándares adecuados de
                protección de datos.
              </p>
            </div>
          </div>

          {/* Sección 9 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">9</div>
              <p className="tyc-section-title">Seguridad de la información</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                Aplicamos medidas técnicas y organizativas, incluyendo:
              </p>
              {[
                "Cifrado en tránsito (TLS)",
                "Cifrado en reposo",
                "Control de accesos restringido",
                "Monitoreo y registro de actividad",
                "Protección contra accesos no autorizados",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 10 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">10</div>
              <p className="tyc-section-title">Retención de datos</p>
            </div>
            <div className="tyc-section-body">
              {[
                "Datos personales: mientras la cuenta esté activa",
                "Registros de acceso: hasta 90 días",
                "Logs de videollamadas: según necesidad operativa del sistema",
                "Mensajes: se conservan mientras el usuario mantenga su cuenta activa",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>En caso de eliminación de cuenta:</p>
              {[
                "Los datos serán eliminados dentro de 30 días",
                "Podrán mantenerse temporalmente en backups",
                "Luego serán eliminados o anonimizados de forma definitiva",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 11 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">11</div>
              <p className="tyc-section-title">Derechos del usuario</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>Podés ejercer los siguientes derechos:</p>
              {["Acceso", "Rectificación", "Supresión", "Oposición", "Portabilidad"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="tyc-subsection-title" style={{ marginTop: 12 }}>Para ejercerlos:</p>
              <div className="tyc-contact-row" style={{ marginBottom: 8 }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "#7D1522", marginRight: 10, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}>privacidad@albieroseguridad.com.ar</p>
              </div>
              <div className="tyc-contact-row" style={{ marginBottom: 10 }}>
                <FontAwesomeIcon icon={faSliders} style={{ color: "#7D1522", marginRight: 10, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}>Desde la app (sección "Mi cuenta")</p>
              </div>
              <p className="guest-info-email">
                Responderemos dentro de los plazos legales. También podés reclamar ante la
                Dirección Nacional de Protección de Datos Personales.
              </p>
            </div>
          </div>

          {/* Sección 12 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">12</div>
              <p className="tyc-section-title">Permisos de la aplicación</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 10 }}>La app puede solicitar:</p>
              {[
                { icon: faCamera, text: "Cámara → escaneo de QR" },
                { icon: faMicrophone, text: "Micrófono → videollamadas" },
                { icon: faBell, text: "Notificaciones → alertas de acceso" },
                { icon: faWifi, text: "Internet → conexión con servidores" },
                { icon: faHardDrive, text: "Almacenamiento (opcional) → uso interno de la app si corresponde" },
              ].map((item, i) => (
                <div key={i} className="tyc-contact-row" style={{ marginBottom: 8 }}>
                  <FontAwesomeIcon icon={item.icon} style={{ color: "#7D1522", marginRight: 10, width: 16 }} />
                  <span className="guest-info-email" style={{ margin: 0 }}>{item.text}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 8 }}>
                Podés gestionar estos permisos desde tu dispositivo.
              </p>
            </div>
          </div>

          {/* Sección 13 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">13</div>
              <p className="tyc-section-title">Menores de edad</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                La aplicación no está dirigida a menores de 18 años.
              </p>
              <div className="tyc-note">
                <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 8, color: "#7D5A00" }} />
                Si detectamos datos de menores, serán eliminados de forma inmediata.
              </div>
              <p className="guest-info-email" style={{ marginTop: 10 }}>
                Padres o tutores pueden contactarnos para solicitar eliminación.
              </p>
            </div>
          </div>

          {/* Sección 14 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">14</div>
              <p className="tyc-section-title">Cambios en la política</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                Podemos actualizar esta política periódicamente. En caso de cambios relevantes:
              </p>
              {["Se notificará dentro de la app o por email"].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 8 }}>
                El uso continuo implica aceptación de los cambios.
              </p>
            </div>
          </div>

          {/* Sección 15 — Contacto */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">15</div>
              <p className="tyc-section-title">Contacto</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 12 }}>
                Para consultas relacionadas con esta política, podés comunicarte con nosotros:
              </p>
              <div className="tyc-contact-row" style={{ marginBottom: 10 }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ color: "#7D1522", marginRight: 10, fontSize: 14, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}>info@albiero.com.ar</p>
              </div>
              <div className="tyc-contact-row">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: "#7D1522", marginRight: 10, fontSize: 14, width: 16 }} />
                <p className="guest-info-email" style={{ margin: 0 }}>Tucumán - Argentina</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <FooterDos />

    </div>
  );
};

export default PoliticaPrivacidad;