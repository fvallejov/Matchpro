import Header, { MobileStickyCta } from "./sections/Header";
import Hero, { Ticker } from "./sections/Hero";
import { SocialProof, Problema, ComoFunciona } from "./sections/Core";
import Partido from "./sections/Partido";
import Progreso from "./sections/Progreso";
import TrueRank from "./sections/TrueRank";
import { Deportes, Clubes, Pricing } from "./sections/Negocio";
import { Testimonios, Faq, CtaFinal, Footer } from "./sections/Cierre";

/*
  Arquitectura (auditoría, sección 14):
  Hero → Social proof → Problema → Cómo funciona → El partido completo
  → TrueRank → Deportes → Clubes → Precios → Testimonios → FAQ → CTA → Footer
*/

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <SocialProof />
        <Problema />
        <ComoFunciona />
        <Partido />
        <Progreso />
        <TrueRank />
        <Deportes />
        <Clubes />
        <Pricing />
        <Testimonios />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
