import HerosecurityIncendio from '../components/Incendio/HerosecurityIncendio.jsx';
import SecurityMarqueeIncendio from '../components/Incendio/SecurityMarqueeIncendio.jsx';
import ExpertiseAreasIncendio from '../components/Incendio/ExpertiseAreasIncendio.jsx';
import HowItWorksIncendio from '../components/Incendio/HowItWorksIncendio.jsx';
import RespaldoAlbieroIncendio from '../components/Incendio/RespaldoAlbieroIncendio.jsx';
import FAQIncendio from '../components/Incendio/FAQIncendio.jsx'
import FinalCTAIncendio from '../components/Incendio/FinalCTAIncendio.jsx'
import Footer from '../components/Footer.jsx'
import HeroNavIncendio from '../components/Incendio/HeroNavIncendio.jsx'

export default function KitAlarmaIncendio() {
    return (
        <div className='homeScreen-container'>
            <HeroNavIncendio />
            <HerosecurityIncendio />
            <SecurityMarqueeIncendio />
            <ExpertiseAreasIncendio />
            <RespaldoAlbieroIncendio />
            <HowItWorksIncendio />
            <FAQIncendio />
            <FinalCTAIncendio />
            <Footer />
        </div>
    );
}