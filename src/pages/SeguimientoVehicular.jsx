import Herosecurity from '../components/SeguimientoVehicular/Herosecurity.jsx';
import SecurityMarquee from '../components/SeguimientoVehicular/SecurityMarquee.jsx';
import ExpertiseAreas from '../components/SeguimientoVehicular/ExpertiseAreas.jsx';
import HowItWorks from '../components/SeguimientoVehicular/HowItWorks.jsx';
import RespaldoAlbiero from '../components/SeguimientoVehicular/RespaldoAlbiero.jsx';
import FAQ from '../components/SeguimientoVehicular/FAQ.jsx'
import FinalCTA from '../components/SeguimientoVehicular/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'
import HeroNav from '../components/SeguimientoVehicular/HeroNav.jsx'
import ComodatoBeneficios from '../components/SeguimientoVehicular/ComodatoBeneficios.jsx';

export default function HomeScreen() {
    return (
        <div className='homeScreen-container'>
            <HeroNav />
            <Herosecurity />
            <SecurityMarquee />
            <ExpertiseAreas />
            <RespaldoAlbiero />
            <HowItWorks />
            <ComodatoBeneficios />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}