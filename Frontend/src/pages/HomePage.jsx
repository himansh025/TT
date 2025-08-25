import React from 'react'
import Header from '../Comp/homepage/Header';
import Hero from '../Comp/homepage/Hero';
import Features from '../Comp/homepage/Features';
import Stats from '../Comp/homepage/Stats';
import About from '../Comp/homepage/About';
import Footer from '../Comp/homepage/Footer';
// import './App.css';
function HomePage() {
  return (
    <>
     {/* <Header /> */}
      <Hero />
      <Features />
      {/* <Stats /> */}
      <About />
      <Footer />
    </>
  )
}

export default HomePage