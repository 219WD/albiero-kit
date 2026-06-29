import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import "./LeadContactStep.css";

const LeadContactStep = ({ formData, formError, onChange, onBack, onSubmit }) => (
  <div className="form-step">
    <h4 className="step-titulo">Paso 4: Dejanos tus datos para asesorarte</h4>
    <div className="contact-fields">
      <label className="contact-field">
        <span>
          <FontAwesomeIcon icon={faUser} aria-hidden="true" /> Nombre
        </span>
        <input
          type="text"
          value={formData.nombre}
          onChange={(event) => onChange("nombre", event.target.value)}
          placeholder="Tu nombre"
          autoComplete="name"
        />
      </label>

      <label className="contact-field">
        <span>
          <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" /> Email
        </span>
        <input
          type="email"
          value={formData.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
        />
      </label>

      <label className="contact-field">
        <span>
          <FontAwesomeIcon icon={faPhone} aria-hidden="true" /> WhatsApp
        </span>
        <input
          type="tel"
          value={formData.telefono}
          onChange={(event) => onChange("telefono", event.target.value)}
          placeholder="381 000 0000"
          autoComplete="tel"
        />
      </label>
    </div>

    {formError && <p className="form-error">{formError}</p>}

    <div className="form-cta">
      <button className="cta-principal" type="button" onClick={onSubmit}>
        Enviar por WhatsApp
      </button>
    </div>

    <button onClick={onBack} className="btn-volver" aria-label="Volver al paso 3">
      <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" /> Volver
    </button>
  </div>
);

export default LeadContactStep;
