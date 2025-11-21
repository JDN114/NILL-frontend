import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import About from "./About";
import Feature from "./Feature";
import Footer from "./Footer";

console.log('%c[LandingPage] Component loaded', 'color: purple;');

export default function LandingPage() {
   console.log('[LandingPage] Rendering...');

   return (
     <>
       <Header />
       <Hero />
       <About />
       <Feature />
       <Footer />
     </>
   );
}

