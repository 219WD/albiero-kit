import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Clarity from '@microsoft/clarity';
import { sendMetaEvent } from './utils/metaEvents';
import GoogleTagManager from './components/GoogleTagManager.jsx';
import HomeScreen from './pages/HomeScreen.jsx';
import KitAlarmaCamara from './pages/KitAlarmaCamara.jsx';
import SeguimientoVehicular from './pages/SeguimientoVehicular.jsx';
import Alarmas from './pages/Alarmas.jsx';
import Camaras from './pages/Camaras.jsx';
import Analiticas from './pages/Analiticas/Analiticas';
import DeteccionIncendios from './pages/DeteccionIncendios.jsx';
import SeguridadIntegral from './pages/SeguridadIntegral.jsx';
import TerminosYCondiciones from './pages/TerminosYCondiciones.jsx';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx';

function MetaPageViewTracker() {
    const location = useLocation();

    useEffect(() => {
        sendMetaEvent('track', 'PageView', {
            content_name: document.title,
            page_path: `${location.pathname}${location.search}`,
        }, { warnPrefix: 'Pixel PageView' });
    }, [location.pathname, location.search]);

    return null;
}

function App() {
    useEffect(() => {
        Clarity.init('vt5t07r3a8');
    }, []);

    return (
        <Router>
            <GoogleTagManager id="GTM-M4JF5GV3" />
            <MetaPageViewTracker />
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/alarmas" element={<Alarmas />} />
                <Route path="/camaras" element={<Camaras />} />
                <Route path="/kit-alarma-camara" element={<KitAlarmaCamara />} />
                <Route path="/seguimiento-vehicular" element={<SeguimientoVehicular />} />
                <Route path="/deteccion-incendios" element={<DeteccionIncendios />} />
                <Route path="/seguridad-integral" element={<SeguridadIntegral />} />
                <Route path="/analiticas" element={<Analiticas />} />
                <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />
                <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            </Routes>
        </Router>
    );
}

export default App;
