import Herosecurity from '../components/Herosecurity.jsx';
import SecurityMarquee from '../components/SecurityMarquee.jsx';
import ExpertiseAreas from '../components/ExpertiseAreas.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import RespaldoAlbiero from '../components/RespaldoAlbiero.jsx';
import FAQ from '../components/FAQ.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
import Footer from '../components/Footer.jsx'
import HeroNav from '../components/HeroNav.jsx'

export default function HomeScreen() {
    return (
        <div className='homeScreen-container'>
            <HeroNav />
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