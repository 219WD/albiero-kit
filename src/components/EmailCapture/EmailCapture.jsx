import { useState } from "react";
import "./EmailCapture.css";
import { sendMetaEvent, setMetaAdvancedMatching } from "../../utils/metaEvents";

const PROD_API_BASE = "https://albi-backend-six.vercel.app";
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_ANALYTICS_API_URL || "";
const API_BASE = isLocalHost
  ? (configuredApiBase.includes("localhost") ? configuredApiBase : "http://localhost:4000")
  : (configuredApiBase.includes("localhost") ? PROD_API_BASE : configuredApiBase || PROD_API_BASE);

export default function EmailCapture() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!nombre.trim()) {
      setError("Ingresá tu nombre.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const contact = { nombre: nombre.trim(), email: email.trim().toLowerCase() };
      const response = await fetch(`${API_BASE}/api/emailmkt/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          source: "email_capture",
          bienvenidaEnviada: true,
        }),
      });
      if (!response.ok) throw new Error("No se pudo guardar la suscripción.");
      setSuccess(true);
      localStorage.setItem("albiero_subscribed", "1");
      localStorage.setItem("albiero_nombre", contact.nombre);
      localStorage.setItem("albiero_email", contact.email);
      setMetaAdvancedMatching(contact);
      sendMetaEvent("trackCustom", "Newsletter_Suscripcion", {
        content_name: "Newsletter Albiero Seguridad",
      }, { warnPrefix: "Pixel Newsletter" });
    } catch {
      setError("No pudimos guardar tu suscripción. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="nl-bar" aria-labelledby="newsletter-title">
      <div className="nl-bar__text">
        <span className="nl-bar__tag">Newsletter Albiero</span>
        <h3 className="nl-bar__title" id="newsletter-title">
          Suscribite a la empresa líder de seguridad de Tucumán
        </h3>
        <p className="nl-bar__subtitle">Recibí novedades y consejos para proteger tu casa o negocio.</p>
      </div>
      <div className="nl-bar__actions">
        {success ? (
          <p className="nl-bar__title" role="status">Ya estás suscripto. Gracias por sumarte a Albiero.</p>
        ) : (
          <form className="nl-bar__form" onSubmit={handleSubmit}>
            <div className="nl-bar__input-row">
              <input className="nl-bar__input" aria-label="Nombre" placeholder="Tu nombre"
                autoComplete="name" value={nombre} onChange={(event) => setNombre(event.target.value)}
                required maxLength={120} />
            </div>
            <div className="nl-bar__input-row">
              <input className="nl-bar__input" type="email" aria-label="Email" placeholder="tu@email.com"
                autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <button className="nl-bar__main-btn" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Suscribirme"}
            </button>
            {error && <p className="ec-error-msg" role="alert">{error}</p>}
          </form>
        )}
        <p className="nl-bar__disclaimer">Podés darte de baja cuando quieras.</p>
      </div>
    </section>
  );
}
