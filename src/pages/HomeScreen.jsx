
import HeroBranding from "../components/HomeScreen/HeroBranding.jsx";
import SecurityMarqueeHome from '../components/HomeScreen/SecurityMarqueeHome.jsx';
import ServiciosPrincipales from "../components/HomeScreen/ServiciosPrincipales.jsx";
import DiferencialAlbiero from "../components/HomeScreen/DiferencialAlbiero.jsx";
import HowItWorksHome from "../components/HomeScreen/HowItWorksHome.jsx";
import CoberturaZonas from "../components/HomeScreen/CoberturaZonas.jsx";
import GeoAuthorityHome from "../components/HomeScreen/GeoAuthorityHome.jsx";
import FAQ from "../components/HomeScreen/FAQ.jsx";
import FinalCTA from "../components/HomeScreen/FinalCTA.jsx";
import HeroNavHome from "../components/HomeScreen/HeroNavHome.jsx";
import WorkWithUs from '../components/HomeScreen/WorkWithUs.jsx'
import Footer from "../components/Footer.jsx";
import GeoEntitySchema from "../components/Seo/GeoEntitySchema.jsx";

export default function HomeScreen() {
  return (
    <div className="homeScreen-container">
      <GeoEntitySchema />
      <HeroNavHome />
      <HeroBranding />
      <SecurityMarqueeHome />
      <ServiciosPrincipales />
      <DiferencialAlbiero />
      <CoberturaZonas />
      <GeoAuthorityHome />
      <HowItWorksHome />
      <FAQ />
      <FinalCTA />
      <WorkWithUs />
      <Footer />
    </div>
  );
}
