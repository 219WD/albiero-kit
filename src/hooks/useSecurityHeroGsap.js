import { useEffect } from "react";
import gsap from "gsap";

const useSecurityHeroGsap = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Título principal
      tl.fromTo(".security-titulo", {
        y: 60, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 1.2
      })

      // Subtítulo
      .fromTo(".security-subtitulo", {
        y: 40, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 1
      }, "-=0.7")

      // Formulario
      .fromTo(".security-form", {
        y: 50, opacity: 0, scale: 0.95
      }, {
        y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)"
      }, "-=0.5")

      // Breadcrumb
      .fromTo(".security-breadcrumb", {
        x: -30, opacity: 0
      }, {
        x: 0, opacity: 1, duration: 0.8
      }, "-=1")

      // Scroll indicator
      .fromTo(".security-scroll", {
        y: -20, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 0.8
      }, "-=0.6");

    });

    return () => ctx.revert();
  }, []);
};

export default useSecurityHeroGsap;