import HerosecurityGps from '../components/SeguimientoVehicular/HerosecurityGps.jsx';
import SecurityMarqueeGps from '../components/SeguimientoVehicular/SecurityMarqueeGps.jsx';
import ExpertiseAreasGps from '../components/SeguimientoVehicular/ExpertiseAreasGps.jsx';
import HowItWorksGps from '../components/SeguimientoVehicular/HowItWorksGps.jsx';
import RespaldoAlbieroGps from '../components/SeguimientoVehicular/RespaldoAlbieroGps.jsx';
import FAQGps from '../components/SeguimientoVehicular/FAQGps.jsx'
import FinalCTAGps from '../components/SeguimientoVehicular/FinalCTAGps.jsx'
import Footer from '../components/Footer.jsx'
import HeroNavGps from '../components/SeguimientoVehicular/HeroNavGps.jsx'
import ComodatoBeneficios from '../components/SeguimientoVehicular/ComodatoBeneficios.jsx';

export default function HomeScreen() {
    return (
        <div className='homeScreen-container'>
            <HeroNavGps />
            <HerosecurityGps />
            <SecurityMarqueeGps />
            <ExpertiseAreasGps />
            <RespaldoAlbieroGps />
            <HowItWorksGps />
            <ComodatoBeneficios />
            <FAQGps />
            <FinalCTAGps />
            <Footer />
        </div>
    );
}