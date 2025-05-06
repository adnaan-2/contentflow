import React from 'react';
import '../styles/Homepage.css';

const AboutSection = () => (
  <section id="about" className="about-section">
    <div className="container">
      <h2>About Us</h2>
      <p className="section-intro">We're on a mission to simplify content management for everyone.</p>
      <div className="about-grid">
        <div className="about-item">
          <h3>Our Story</h3>
          <p>Founded in 2023, ContentFlow began with a simple idea: make content management accessible to everyone, regardless of technical skill.</p>
        </div>
        <div className="about-item">
          <h3>Our Mission</h3>
          <p>We're committed to providing intuitive tools that help businesses and creators focus on what matters most - creating great content.</p>
        </div>
        <div className="about-item">
          <h3>Our Team</h3>
          <p>Our diverse team brings together expertise in design, engineering, and content strategy to build the best platform possible.</p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
