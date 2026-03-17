import HerosecuritySeguridadIntegral from '../components/SeguridadIntegral/HerosecuritySeguridadIntegral.jsx';
import SecurityMarqueeSeguridadIntegral from '../components/SeguridadIntegral/SecurityMarqueeSeguridadIntegral.jsx';
import ExpertiseAreasSeguridadIntegral from '../components/SeguridadIntegral/ExpertiseAreasSeguridadIntegral.jsx';
import HowItWorksSeguridadIntegral from '../components/SeguridadIntegral/HowItWorksSeguridadIntegral.jsx';
import RespaldoAlbieroSeguridadIntegral from '../components/SeguridadIntegral/RespaldoAlbieroSeguridadIntegral.jsx';
import FAQSeguridadIntegral from '../components/SeguridadIntegral/FAQSeguridadIntegral.jsx'
import Footer from '../components/Footer.jsx'
import HeroNavSeguridadIntegral from '../components/SeguridadIntegral/HeroNavSeguridadIntegral.jsx'
import FinalCTASeguridadIntegral from '../components/SeguridadIntegral/FinalCTASeguridadIntegral.jsx'

export default function SeguridadIntegral() {
    return (
        <div className='homeScreen-container'>
            <HeroNavSeguridadIntegral />
            <HerosecuritySeguridadIntegral />
            <SecurityMarqueeSeguridadIntegral />
            <ExpertiseAreasSeguridadIntegral />
            <RespaldoAlbieroSeguridadIntegral />
            <HowItWorksSeguridadIntegral />
            <FAQSeguridadIntegral />
            <FinalCTASeguridadIntegral />
            <Footer />
        </div>
    );
}