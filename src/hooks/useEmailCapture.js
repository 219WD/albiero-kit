// hooks/useEmailCapture.js
import { useState, useEffect, useCallback } from "react";

// ⚠️ REEMPLAZAR con la URL de tu Google Apps Script deployment
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec";

const MODAL_DELAY_MS = 500; // 8 segundos antes de mostrar el modal
const STORAGE_KEY_MODAL = "albiero_modal_shown";
const STORAGE_KEY_SUBSCRIBED = "albiero_subscribed";

export const useEmailCapture = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { message, codigo }
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState(null);

  // Mostrar modal automáticamente después del delay
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY_MODAL);
    const alreadySubscribed = localStorage.getItem(STORAGE_KEY_SUBSCRIBED);

    if (!alreadyShown && !alreadySubscribed) {
      const timer = setTimeout(() => {
        setModalOpen(true);
        sessionStorage.setItem(STORAGE_KEY_MODAL, "true");
      }, MODAL_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  const submitEmail = useCallback(async ({ email, nombre, tipo = "newsletter" }) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor ingresá un email válido.");
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Google Apps Script requiere no-cors
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre, tipo }),
      });

      // Con no-cors no podemos leer la respuesta, asumimos éxito
      // Para leer la respuesta, usar un proxy o cambiar la config del script
      localStorage.setItem(STORAGE_KEY_SUBSCRIBED, "true");

      const codigoGenerado = tipo === "descuento"
        ? "ALBIERO" + (Math.floor(Math.random() * 9000) + 1000)
        : null;

      setSuccess({
        message: tipo === "descuento"
          ? "¡Listo! Tu descuento fue enviado."
          : "¡Gracias por suscribirte! 🎉",
        codigo: codigoGenerado,
      });

      if (tipo === "descuento") {
        setDiscountCode(codigoGenerado);
      }

      return true;
    } catch (err) {
      setError("Hubo un error al registrar tu email. Intentá de nuevo.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSuccess(null);
    setError(null);
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
    setSuccess(null);
    setError(null);
  }, []);

  const resetState = useCallback(() => {
    setSuccess(null);
    setError(null);
  }, []);

  return {
    modalOpen,
    loading,
    success,
    error,
    discountCode,
    submitEmail,
    closeModal,
    openModal,
    resetState,
  };
};