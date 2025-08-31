import React, { useState } from 'react';
import './CSS/HelplineService.css';

const HelplineService = () => {
  const [activeTab, setActiveTab] = useState('crisis');

  const helplines = {
    crisis: [
      { name: "National Suicide Prevention Lifeline", number: "988", available: "24/7" },
      { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
      { name: "Veterans Crisis Line", number: "1-800-273-8255", available: "24/7" }
    ],
    emotional: [
      { name: "Emotional Support Helpline", number: "1-800-932-4616", available: "24/7" },
      { name: "Warmline for Loneliness", number: "1-877-404-3190", available: "6PM-11PM" }
    ],
    youth: [
      { name: "Teen Line", number: "1-800-852-8336", available: "6PM-10PM" },
      { name: "Youth Emergency Service", number: "1-800-680-4264", available: "24/7" }
    ]
  };

  return (
    <div className="helpline-container">
      <div className="helpline-hero">
        <h1>Immediate Help When You Need It Most</h1>
        <p>Our compassionate helpline services are available 24/7 to provide support, guidance, and a listening ear.</p>
      </div>

      <div className="helpline-tabs">
        <button 
          className={activeTab === 'crisis' ? 'active' : ''} 
          onClick={() => setActiveTab('crisis')}
        >
          Crisis Helplines
        </button>
        <button 
          className={activeTab === 'emotional' ? 'active' : ''} 
          onClick={() => setActiveTab('emotional')}
        >
          Emotional Support
        </button>
        <button 
          className={activeTab === 'youth' ? 'active' : ''} 
          onClick={() => setActiveTab('youth')}
        >
          Youth Support
        </button>
      </div>

      <div className="helpline-content">
        {helplines[activeTab].map((line, index) => (
          <div key={index} className="helpline-card">
            <div className="helpline-info">
              <h3>{line.name}</h3>
              <p className="helpline-number">{line.number}</p>
              <p className="helpline-availability">Available: {line.available}</p>
            </div>
            <div className="helpline-action">
              <a href={`tel:${line.number.replace(/\D/g, '')}`} className="call-button">
                Call Now
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="helpline-extra">
        <h2>What to Expect When You Call</h2>
        <div className="expectation-cards">
          <div className="expectation-card">
            <div className="expectation-icon">👂</div>
            <h3>A Listening Ear</h3>
            <p>Our trained volunteers are here to listen without judgment.</p>
          </div>
          <div className="expectation-card">
            <div className="expectation-icon">💬</div>
            <h3>Confidential Support</h3>
            <p>Your conversation is completely private and confidential.</p>
          </div>
          <div className="expectation-card">
            <div className="expectation-icon">🤝</div>
            <h3>Resources & Guidance</h3>
            <p>We can connect you with local resources and support options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelplineService;