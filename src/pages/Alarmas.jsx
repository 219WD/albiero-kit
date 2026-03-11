import HerosecurityAlarmas from '../components/Alarmas/HerosecurityAlarmas.jsx';
import SecurityMarquee from '../components/Alarmas/SecurityMarquee.jsx';
import ExpertiseAreasAlarmas from '../components/Alarmas/ExpertiseAreasAlarmas.jsx';
import HowItWorksAlarmas from '../components/Alarmas/HowItWorksAlarmas.jsx';
import RespaldoAlbiero from '../components/Alarmas/RespaldoAlbiero.jsx';
import FAQAlarmas from '../components/Alarmas/FAQAlarmas.jsx'
import FinalCTA from '../components/Alarmas/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'
import HeroNav from '../components/Alarmas/HeroNav.jsx'

export default function KitAlarmaCamara() {
    return (
        <div className='homeScreen-container'>
            <HeroNav />
            <HerosecurityAlarmas />
            <SecurityMarquee />
            <ExpertiseAreasAlarmas />
            <RespaldoAlbiero />
            <HowItWorksAlarmas />
            <FAQAlarmas />
            <FinalCTA />
            <Footer />
        </div>
    );
}