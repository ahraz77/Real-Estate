import React, { useEffect } from 'react'
import Hero from '../components/aboutus/Hero';
import Mission from '../components/aboutus/Mission';
import Values from '../components/aboutus/Values';
import Benefits from '../components/aboutus/Benefit';
import Milestones from '../components/aboutus/Milestone'; 

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-hidden">
      <Hero />
      <Mission />
      <Values />
      <Benefits />
      <Milestones />
    </div>
  )
}

export default About
