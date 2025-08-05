import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/1992-153555258.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="overlay" />

      {/* Main Content */}
      <div className="homepage-content">
        <h1>Welcome to CryptoCrest</h1>
        <p className="subtitle">Real-time insights. Smarter trading decisions.</p>
        <p className="description">
          Analyze historical data, forecast trends with AI, and make informed financial decisions with ease.
        </p>

        <div className="cta-buttons">
          <a href="/register" className="cta-button outline">Get Started</a>
          <a href="/dashboard" className="cta-button solid">Go to Dashboard</a>
        </div>

        {/* Feature Highlights Section */}
        <div className="feature-highlights">
          <div className="feature-card">
            <h3>Live Charts & Indicators</h3>
            <p>Track prices with advanced technical tools and indicators.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Authentication</h3>
            <p>Your data and trades protected with top-notch security.</p>
          </div>
          <div className="feature-card">
            <h3>AI-Powered Predictions</h3>
            <p>Leverage AI to forecast trends and improve your trading decisions.</p>
          </div>
          <div className="feature-card">
            <h3>Trading Simulation</h3>
            <p>Practice trading with real data, no risk, improve strategies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
