import Hero from './components/Hero';
import Intro from './components/Intro';
import Work from './components/Work';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Process from './components/Process';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <main className="bg-[#EFEFEF]">
        <Hero />
        <Intro />
        <Work />
        <Services />
        <Pricing />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
