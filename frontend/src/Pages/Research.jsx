import React, { useState } from 'react';
import './CSS/Research.css';

const Research = () => {
  const [activeTab, setActiveTab] = useState('current');

  const researchStudies = [
    {
      id: 1,
      title: "The Efficacy of Peer Support in Suicide Prevention",
      category: "current",
      status: "Ongoing",
      description: "This study examines how peer support networks impact suicide prevention outcomes in young adults.",
      researchers: "Dr. Sarah Johnson, Dr. Michael Chen",
      timeline: "January 2023 - December 2024"
    },
    {
      id: 2,
      title: "Digital Interventions for Loneliness Reduction",
      category: "current",
      status: "Data Analysis",
      description: "Research on the effectiveness of digital tools and platforms in reducing feelings of social isolation.",
      researchers: "Dr. Emily Rodriguez, Dr. James Wilson",
      timeline: "June 2022 - Present"
    },
    {
      id: 3,
      title: "Cultural Competency in Mental Health Helplines",
      category: "current",
      status: "Recruiting",
      description: "A study exploring how cultural competency training affects helpline outcomes for diverse populations.",
      researchers: "Dr. Amina Jones, Dr. Carlos Mendez",
      timeline: "March 2023 - February 2025"
    },
    {
      id: 4,
      title: "Long-term Outcomes of Crisis Intervention",
      category: "completed",
      status: "Published",
      description: "A 5-year follow-up study on individuals who received crisis intervention support.",
      researchers: "Dr. Robert Kim, Dr. Lisa Patterson",
      timeline: "Completed April 2022",
      findings: "Participants showed 65% reduction in subsequent crisis episodes compared to control group."
    },
    {
      id: 5,
      title: "Effectiveness of Text-Based Support",
      category: "completed",
      status: "Published",
      description: "Research comparing outcomes between text-based and voice-based emotional support.",
      researchers: "Dr. Jennifer Park, Dr. David Miller",
      timeline: "Completed October 2021",
      findings: "Text-based support was particularly effective for adolescents and those with social anxiety."
    }
  ];

  const filteredStudies = researchStudies.filter(study => study.category === activeTab);

  return (
    <div className="research-container">
      <div className="research-hero">
        <h1>Research Initiatives</h1>
        <p>Advancing mental health support through evidence-based research and innovation</p>
      </div>

      <div className="research-content">
        <div className="research-intro">
          <h2>Building the Evidence Base for Mental Health Support</h2>
          <p>At FriendlyHelp, we believe in the power of research to improve mental health interventions. Our studies focus on evaluating and enhancing support methods, understanding mental health challenges, and developing innovative approaches to care.</p>
        </div>

        <div className="research-tabs">
          <div className="tabs-header">
            <button 
              className={activeTab === 'current' ? 'active' : ''} 
              onClick={() => setActiveTab('current')}
            >
              Current Studies
            </button>
            <button 
              className={activeTab === 'completed' ? 'active' : ''} 
              onClick={() => setActiveTab('completed')}
            >
              Completed Research
            </button>
          </div>

          <div className="tabs-content">
            <div className="studies-grid">
              {filteredStudies.map(study => (
                <div key={study.id} className="study-card">
                  <div className={`study-status ${study.status.toLowerCase().replace(' ', '-')}`}>
                    {study.status}
                  </div>
                  <h3>{study.title}</h3>
                  <p className="study-description">{study.description}</p>
                  <div className="study-details">
                    <div className="detail-item">
                      <span className="label">Researchers:</span>
                      <span className="value">{study.researchers}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Timeline:</span>
                      <span className="value">{study.timeline}</span>
                    </div>
                    {study.findings && (
                      <div className="detail-item">
                        <span className="label">Key Findings:</span>
                        <span className="value">{study.findings}</span>
                      </div>
                    )}
                  </div>
                  {study.status === "Recruiting" && (
                    <button className="participate-btn">Learn About Participation</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="research-collaboration">
          <h2>Research Collaboration Opportunities</h2>
          <div className="collaboration-content">
            <div className="collaboration-text">
              <p>We partner with academic institutions, healthcare organizations, and community groups to advance mental health research. Our current collaboration priorities include:</p>
              <ul>
                <li>Digital mental health interventions</li>
                <li>Culturally-responsive care models</li>
                <li>Peer support effectiveness</li>
                <li>Preventative mental health strategies</li>
              </ul>
              <p>If you're interested in collaborating on research, please contact our research department.</p>
              <button className="collaborate-btn">Contact Research Team</button>
            </div>
            <div className="collaboration-image">
              <div className="placeholder-image">🔬</div>
            </div>
          </div>
        </div>

        <div className="research-resources">
          <h2>Resources for Researchers</h2>
          <div className="resources-grid">
            <div className="research-resource">
              <h3>Data Requests</h3>
              <p>Learn about our process for requesting anonymized data for research purposes.</p>
              <a href="#" className="resource-link">Data Request Guidelines</a>
            </div>
            <div className="research-resource">
              <h3>IRB Process</h3>
              <p>Information about our Institutional Review Board and approval process.</p>
              <a href="#" className="resource-link">IRB Information</a>
            </div>
            <div className="research-resource">
              <h3>Publication Archive</h3>
              <p>Access our library of published research findings and reports.</p>
              <a href="#" className="resource-link">View Publications</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;