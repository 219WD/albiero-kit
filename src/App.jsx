import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Clarity from '@microsoft/clarity';
import { sendMetaEvent } from './utils/metaEvents';
import HomeScreen from './pages/HomeScreen.jsx';
import KitAlarmaCamara from './pages/KitAlarmaCamara.jsx';
import SeguimientoVehicular from './pages/SeguimientoVehicular.jsx';
import Alarmas from './pages/Alarmas.jsx';
import Camaras from './pages/Camaras.jsx';
import Analiticas from './pages/Analiticas/Analiticas';
import EmailMkt from './pages/EmailMkt/EmailMkt.jsx';
import AdminUsers from './pages/AdminUsers/AdminUsers.jsx';
import Promos from './pages/Promos/Promos.jsx';
import Leads from './pages/Leads/Leads.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Reportes from './pages/Reportes/Reportes.jsx';
import Informe from './pages/Informe/Informe.jsx';
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
            <MetaPageViewTracker />
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/alarmas" element={<Alarmas />} />
                <Route path="/camaras" element={<Camaras />} />
                <Route path="/kit-alarma-camara" element={<KitAlarmaCamara />} />
                <Route path="/seguimiento-vehicular" element={<SeguimientoVehicular />} />
                <Route path="/deteccion-incendios" element={<DeteccionIncendios />} />
                <Route path="/seguridad-integral" element={<SeguridadIntegral />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analiticas" element={<Analiticas />} />
                <Route path="/emailmkt" element={<EmailMkt />} />
                <Route path="/usuarios" element={<AdminUsers />} />
                <Route path="/promos" element={<Promos />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/informe/:token" element={<Informe />} />
                <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />
                <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            </Routes>
        </Router>
    );
}

export default App;
