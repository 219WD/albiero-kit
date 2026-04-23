import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEnvelope,
  faMapMarkerAlt,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./TerminosYCondiciones.css";
import FooterDos from "../components/FooterDos";
import LogoGrande from "../assets/logo-grande.png";

const TerminosYCondiciones = () => {
  return (
    <div className="tyc-root">

      {/* Header */}
      <div className="tyc-header">
        <img src="/logo.png" alt="Logo Albiero Seguridad" className="tyc-header-logo" />
        <span className="modal-title">Términos y Condiciones</span>
      </div>

      {/* Contenido */}
      <div className="messages-container">
        <div className="messages-list">

          {/* Hero */}
          <div className="tyc-hero">
            <img src={LogoGrande} alt="Albiero Seguridad" className="tyc-hero-logo" />
            <div className="tyc-hero-text">
              <p className="tyc-hero-title">Albiero Seguridad</p>
              <p className="tyc-hero-subtitle">
                Aplicación de videoportero QR — Plataforma de gestión de accesos
                y comunicación inteligente para tu inmueble.
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
              <p className="tyc-section-title">Aceptación de los términos</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email">
                Al acceder y utilizar la aplicación de videoportero QR de Albiero Seguridad (en adelante,
                "la Aplicación"), aceptás estos Términos y Condiciones. Si no estás de acuerdo, no debés
                utilizar el servicio.
              </p>
            </div>
          </div>

          {/* Sección 2 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">2</div>
              <p className="tyc-section-title">Descripción del servicio</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>La Aplicación permite:</p>
              {[
                "Gestionar accesos a inmuebles mediante códigos QR",
                "Comunicarse mediante mensajería interna",
                "Realizar videollamadas en tiempo real",
                "Recibir notificaciones sobre eventos de acceso",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <div className="tyc-note">
                <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 8, color: "#7D5A00" }} />
                El servicio es una herramienta de apoyo y no reemplaza sistemas de seguridad
                física ni vigilancia profesional.
              </div>
            </div>
          </div>

          {/* Sección 3 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">3</div>
              <p className="tyc-section-title">Registro y cuenta</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>Para utilizar la Aplicación, debés:</p>
              {[
                "Proporcionar información veraz y actualizada",
                "Mantener la confidencialidad de tus credenciales",
                "Ser responsable de toda actividad realizada desde tu cuenta",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 10 }}>
                Albiero Seguridad no se responsabiliza por accesos indebidos derivados del uso
                negligente de credenciales.
              </p>
            </div>
          </div>

          {/* Sección 4 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">4</div>
              <p className="tyc-section-title">Uso permitido</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                El usuario se compromete a utilizar la Aplicación de forma lícita y adecuada. Está prohibido:
              </p>
              {[
                "Utilizar la app para actividades ilegales",
                "Intentar acceder sin autorización a otros usuarios o sistemas",
                "Interferir con el funcionamiento del servicio",
                "Utilizar la mensajería o videollamadas para acoso, amenazas o contenido ilegal",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-danger">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 5 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">5</div>
              <p className="tyc-section-title">Mensajería y comunicaciones</p>
            </div>
            <div className="tyc-section-body">
              {[
                "Los mensajes pueden ser almacenados para el funcionamiento del servicio",
                "El usuario es responsable del contenido que envía",
                "Albiero Seguridad podrá suspender cuentas ante uso indebido",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 6 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">6</div>
              <p className="tyc-section-title">Videollamadas</p>
            </div>
            <div className="tyc-section-body">
              {[
                "Las videollamadas son en tiempo real",
                "No se almacenan grabaciones de audio ni video",
                "Solo se registran datos técnicos como duración y estado de la llamada",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 10 }}>
                El usuario es responsable del uso adecuado de esta funcionalidad.
              </p>
            </div>
          </div>

          {/* Sección 7 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">7</div>
              <p className="tyc-section-title">Gestión de accesos</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                La Aplicación permite autorizar accesos mediante QR u otros mecanismos. El usuario reconoce que:
              </p>
              {[
                "Es responsable de a quién otorga acceso",
                "Debe revisar periódicamente los permisos otorgados",
                "Albiero Seguridad no se responsabiliza por accesos autorizados incorrectamente por el usuario",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 8 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">8</div>
              <p className="tyc-section-title">Disponibilidad del servicio</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                Albiero Seguridad se esfuerza por mantener el servicio disponible, pero no garantiza:
              </p>
              {[
                "Funcionamiento ininterrumpido",
                "Ausencia de errores",
                "Disponibilidad permanente",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-primary">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 10 }}>
                El servicio puede verse afectado por mantenimiento, fallas técnicas o causas externas.
              </p>
            </div>
          </div>

          {/* Sección 9 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">9</div>
              <p className="tyc-section-title">Limitación de responsabilidad</p>
            </div>
            <div className="tyc-section-body">
              {[
                "Albiero Seguridad no será responsable por daños indirectos o incidentales",
                "No garantiza la prevención de robos, intrusiones u otros eventos de seguridad",
                "El uso del sistema es complementario y bajo responsabilidad del usuario",
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
              <p className="tyc-section-title">Suspensión y cancelación</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                Podemos suspender o cancelar el acceso en caso de:
              </p>
              {[
                "Incumplimiento de estos términos",
                "Uso indebido del servicio",
                "Requerimientos legales",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-danger">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
              <p className="guest-info-email" style={{ marginTop: 10 }}>
                El usuario puede dejar de usar el servicio en cualquier momento.
              </p>
            </div>
          </div>

          {/* Sección 11 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">11</div>
              <p className="tyc-section-title">Propiedad intelectual</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email" style={{ marginBottom: 8 }}>
                La Aplicación, su software y contenidos son propiedad de Albiero Seguridad. Está prohibido:
              </p>
              {[
                "Copiar, modificar o distribuir el software",
                "Realizar ingeniería inversa",
                "Utilizar el sistema con fines comerciales no autorizados",
              ].map((item, i) => (
                <div key={i} className="contact-row" style={{ marginBottom: 6 }}>
                  <span className="tyc-bullet-danger">•</span>
                  <span className="guest-info-email" style={{ margin: 0 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sección 12 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">12</div>
              <p className="tyc-section-title">Privacidad</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email">
                El tratamiento de datos personales se rige por la Política de Privacidad de la Aplicación.
                Se recomienda al usuario leerla detenidamente.
              </p>
            </div>
          </div>

          {/* Sección 13 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">13</div>
              <p className="tyc-section-title">Modificaciones</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email">
                Albiero Seguridad podrá modificar estos términos en cualquier momento. Los cambios serán
                notificados dentro de la Aplicación o por medios digitales. El uso continuado implica
                aceptación de los nuevos términos.
              </p>
            </div>
          </div>

          {/* Sección 14 */}
          <div className="tyc-section">
            <div className="tyc-section-header">
              <div className="tyc-num">14</div>
              <p className="tyc-section-title">Legislación aplicable</p>
            </div>
            <div className="tyc-section-body">
              <p className="guest-info-email">
                Estos Términos se rigen por las leyes de la República Argentina. Ante cualquier conflicto,
                serán competentes los tribunales correspondientes.
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
                Para consultas o reclamos relacionados con estos Términos, podés comunicarte con nosotros:
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

export default TerminosYCondiciones;