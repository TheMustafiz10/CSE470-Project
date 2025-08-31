import React, { useState } from 'react';
import './CSS/Resources.css';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const resources = [
    {
      id: 1,
      title: "Crisis Intervention Guide",
      category: "crisis",
      type: "pdf",
      description: "Step-by-step guide for helping someone in immediate crisis",
      link: "/resources/crisis-guide.pdf"
    },
    {
      id: 2,
      title: "Daily Mental Health Checklist",
      category: "self-care",
      type: "pdf",
      description: "Printable checklist to maintain your mental wellness daily",
      link: "/resources/daily-checklist.pdf"
    },
    {
      id: 3,
      title: "Breathing Exercises for Anxiety",
      category: "techniques",
      type: "audio",
      description: "Guided audio exercises to manage anxiety symptoms",
      link: "/resources/breathing-exercises"
    },
    {
      id: 4,
      title: "Local Support Groups Directory",
      category: "support",
      type: "directory",
      description: "Find in-person and virtual support groups in your area",
      link: "/resources/support-groups"
    },
    {
      id: 5,
      title: "Understanding Depression",
      category: "education",
      type: "article",
      description: "Comprehensive information about depression signs and treatments",
      link: "/resources/understanding-depression"
    },
    {
      id: 6,
      title: "Mindfulness Meditation Series",
      category: "techniques",
      type: "video",
      description: "10-part video series on developing mindfulness practices",
      link: "/resources/mindfulness-series"
    }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf': return '📄';
      case 'audio': return '🎵';
      case 'video': return '🎥';
      case 'directory': return '📋';
      case 'article': return '📖';
      default: return '📄';
    }
  };

  return (
    <div className="resources-container">
      <div className="resources-hero">
        <h1>Mental Health Resources</h1>
        <p>Access our comprehensive library of tools, guides, and information to support your mental health journey</p>
      </div>

      <div className="resources-content">
        <div className="resources-intro">
          <h2>Find the Support You Need</h2>
          <p>We've curated evidence-based resources to help you manage mental health challenges, develop coping strategies, and find appropriate support. All materials are developed in collaboration with mental health professionals.</p>
        </div>

        <div className="category-filter">
          <button 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => setActiveCategory('all')}
          >
            All Resources
          </button>
          <button 
            className={activeCategory === 'crisis' ? 'active' : ''} 
            onClick={() => setActiveCategory('crisis')}
          >
            Crisis Support
          </button>
          <button 
            className={activeCategory === 'self-care' ? 'active' : ''} 
            onClick={() => setActiveCategory('self-care')}
          >
            Self-Care
          </button>
          <button 
            className={activeCategory === 'techniques' ? 'active' : ''} 
            onClick={() => setActiveCategory('techniques')}
          >
            Techniques
          </button>
          <button 
            className={activeCategory === 'support' ? 'active' : ''} 
            onClick={() => setActiveCategory('support')}
          >
            Support Networks
          </button>
          <button 
            className={activeCategory === 'education' ? 'active' : ''} 
            onClick={() => setActiveCategory('education')}
          >
            Education
          </button>
        </div>

        <div className="resources-grid">
          {filteredResources.map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-type">{getTypeIcon(resource.type)}</div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a href={resource.link} className="resource-link">Access Resource</a>
            </div>
          ))}
        </div>

        <div className="emergency-section">
          <h2>Immediate Crisis Support</h2>
          <div className="emergency-content">
            <div className="emergency-info">
              <h3>Need Help Now?</h3>
              <p>If you or someone you know is in immediate danger, please call emergency services or our 24/7 crisis helpline:</p>
              <div className="helpline-number">1-800-273-8255</div>
              <p>Our trained counselors are available anytime, day or night, to provide confidential support.</p>
            </div>
            <div className="emergency-contacts">
              <h4>Additional Crisis Resources:</h4>
              <ul>
                <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                <li><strong>Suicide Prevention Lifeline:</strong> 1-800-273-8255</li>
                <li><strong>Emergency Services:</strong> 911</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="resource-request">
          <h2>Can't Find What You Need?</h2>
          <p>Let us know what specific resources would be helpful for you, and we'll work to add them to our collection.</p>
          <button className="request-btn">Request a Resource</button>
        </div>
      </div>
    </div>
  );
};

export default Resources;