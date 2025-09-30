import React from 'react';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import Slider from '../components/Slider';
import './Home.css';

const Home = () => {
  const scrollToProjectDetails = () => {
    const element = document.getElementById('proje-detayi');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="home">
      <Hero />
      <Slider />
      <Statistics />
      <div className="project-details-link">
        <button onClick={scrollToProjectDetails} className="details-link">
          PROJENİN DETAYI
        </button>
      </div>
    </div>
  );
};

export default Home;
