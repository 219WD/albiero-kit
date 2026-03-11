import Herosecurity from '../components/KitAlarmaCamara/Herosecurity.jsx';
import SecurityMarquee from '../components/KitAlarmaCamara/SecurityMarquee.jsx';
import ExpertiseAreas from '../components/KitAlarmaCamara/ExpertiseAreas.jsx';
import HowItWorks from '../components/KitAlarmaCamara/HowItWorks.jsx';
import RespaldoAlbiero from '../components/KitAlarmaCamara/RespaldoAlbiero.jsx';
import FAQ from '../components/KitAlarmaCamara/FAQ.jsx'
import FinalCTA from '../components/KitAlarmaCamara/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'
import HeroNavKit from '../components/KitAlarmaCamara/HeroNavKit.jsx'

export default function KitAlarmaCamara() {
    return (
        <div className='homeScreen-container'>
            <HeroNavKit />
            <Herosecurity />
            <SecurityMarquee />
            <ExpertiseAreas />
            <RespaldoAlbiero />
            <HowItWorks />
            <FAQ />
            <FinalCTA />
            <Footer />
        </div>
    );
}