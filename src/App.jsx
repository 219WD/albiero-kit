import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clarity from '@microsoft/clarity';
import HomeScreen from './pages/HomeScreen.jsx';
import KitAlarmaCamara from './pages/KitAlarmaCamara.jsx';
import SeguimientoVehicular from './pages/SeguimientoVehicular.jsx';
import Alarmas from './pages/Alarmas.jsx';
import Camaras from './pages/Camaras.jsx';
import Analiticas from './pages/Analiticas/Analiticas';
import DeteccionIncendios from './pages/DeteccionIncendios.jsx';

function App() {
    useEffect(() => {
        Clarity.init('vt5t07r3a8');
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/alarmas" element={<Alarmas />} />
                <Route path="/camaras" element={<Camaras />} />
                <Route path="/kit-alarma-camara" element={<KitAlarmaCamara />} />
                <Route path="/seguimiento-vehicular" element={<SeguimientoVehicular />} />
                <Route path="/deteccion-incendios" element={<DeteccionIncendios />} />
                <Route path="/analiticas" element={<Analiticas />} />
            </Routes>
        </Router>
    );
}

export default App;