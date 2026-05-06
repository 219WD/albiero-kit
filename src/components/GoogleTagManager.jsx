import { useEffect } from 'react';

const GoogleTagManager = ({ id }) => {
  useEffect(() => {
    if (!id || typeof window === 'undefined' || typeof document === 'undefined') return;

    window.dataLayer = window.dataLayer || [];

    if (document.querySelector(`script[data-gtm-id="${id}"]`)) return;

    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.async = true;
    script.dataset.gtmId = id;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
    script.onerror = () => {
      console.warn(`[GTM] No se pudo cargar ${id}`);
    };

    document.head.appendChild(script);
  }, [id]);

  return null;
};

export default GoogleTagManager;
