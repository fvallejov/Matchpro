import Header, { MobileStickyCta } from "./sections/Header";
import Hero, { Ticker } from "./sections/Hero";
import { Clientes, Problema, Video } from "./sections/Core";
import { Operacion, Competencia, Caso } from "./sections/Producto";
import Ecosistema from "./sections/Ecosistema";
import { Implementacion, Confianza, CtaFaq, Footer } from "./sections/Cierre";

/*
  Arquitectura (diagnóstico §14, 12 secciones):
  Hero (dashboard vivo) → Clientes → Problema → Video
  → Operación → Competencia → Caso → Ecosistema (timeline)
  → Implementación → Confianza → CTA+FAQ → Footer
*/

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Clientes />
        <Problema />
        <Video />
        <Operacion />
        <Competencia />
        <Caso />
        <Ecosistema />
        <Implementacion />
        <Confianza />
        <CtaFaq />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
