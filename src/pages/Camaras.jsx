import HerosecurityCamaras from '../components/Camaras/HerosecurityCamaras.jsx';
import SecurityMarquee from '../components/Camaras/SecurityMarquee.jsx';
import ExpertiseAreasCamaras from '../components/Camaras/ExpertiseAreasCamaras.jsx';
import HowItWorksCamaras from '../components/Camaras/HowItWorksCamaras.jsx';
import RespaldoAlbieroCamaras from '../components/Camaras/RespaldoAlbieroCamaras.jsx';
import FAQCamaras from '../components/Camaras/FAQCamaras.jsx'
import FinalCTACamaras from '../components/Camaras/FinalCTACamaras.jsx'
import Footer from '../components/Footer.jsx'
import HeroNavCamaras from '../components/Camaras/HeroNavCamaras.jsx'

export default function KitAlarmaCamara() {
    return (
        <div className='homeScreen-container'>
            <HeroNavCamaras />
            <HerosecurityCamaras />
            <SecurityMarquee />
            <ExpertiseAreasCamaras />
            <RespaldoAlbieroCamaras />
            <HowItWorksCamaras />
            <FAQCamaras />
            <FinalCTACamaras />
            <Footer />
        </div>
    );
}