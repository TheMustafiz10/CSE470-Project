import React, { useState } from 'react';
import './CSS/CorporateWellnessProgram.css';

const CorporateWellnessProgram = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const programBenefits = [
    {
      icon: '📈',
      title: 'Increased Productivity',
      description: 'Employees with better mental health show 12% higher productivity and focus.'
    },
    {
      icon: '💼',
      title: 'Reduced Absenteeism',
      description: 'Companies with wellness programs report 25% lower absenteeism rates.'
    },
    {
      icon: '💰',
      title: 'Lower Healthcare Costs',
      description: 'For every $1 invested in mental health programs, companies see $4 return in improved health and productivity.'
    },
    {
      icon: '🤝',
      title: 'Improved Retention',
      description: '78% of employees are more likely to stay with a company that cares about their wellbeing.'
    }
  ];

  const programOptions = [
    {
      title: 'Mental Health Workshops',
      description: 'Interactive sessions on stress management, resilience building, and emotional intelligence.',
      duration: '2-4 hours',
      format: 'In-person or virtual'
    },
    {
      title: 'Manager Training',
      description: 'Equip leaders with skills to recognize signs of distress and support team members effectively.',
      duration: 'Half-day session',
      format: 'In-person or virtual'
    },
    {
      title: 'Employee Assistance Program',
      description: 'Confidential counseling services for employees and their families.',
      duration: 'Ongoing support',
      format: 'Phone, video, or in-person'
    },
    {
      title: 'Wellness Challenges',
      description: 'Team-based activities promoting mental wellbeing habits and mindfulness practices.',
      duration: '4-8 weeks',
      format: 'Hybrid (app + in-person)'
    }
  ];

  const successStories = [
    {
      company: 'TechInnovate Inc.',
      result: '34% reduction in stress-related leave after implementing our mindfulness program',
      duration: '6 months'
    },
    {
      company: 'Global Finance Partners',
      result: '27% improvement in employee satisfaction scores with our EAP integration',
      duration: '1 year'
    },
    {
      company: 'Nexus Manufacturing',
      result: '41% decrease in turnover after launching manager mental health training',
      duration: '18 months'
    }
  ];

  return (
    <div className="corporate-wellness-container">
      <div className="corporate-hero">
        <div className="hero-content">
          <h1>Corporate Wellness Programs</h1>
          <p>Invest in your most valuable asset—your employees—with tailored mental health and wellbeing solutions</p>
          <button className="cta-button">Request a Consultation</button>
        </div>
        <div className="hero-image">
          <div className="placeholder-graphic">👥</div>
        </div>
      </div>

      <div className="program-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Program Overview
        </button>
        <button 
          className={activeTab === 'options' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('options')}
        >
          Program Options
        </button>
        <button 
          className={activeTab === 'success' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('success')}
        >
          Success Stories
        </button>
        <button 
          className={activeTab === 'getstarted' ? 'tab-active' : ''} 
          onClick={() => setActiveTab('getstarted')}
        >
          Get Started
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="section">
              <h2>Why Invest in Employee Mental Health?</h2>
              <p>In today's fast-paced work environment, mental health support is no longer a luxury—it's a business imperative. Our corporate wellness programs are designed to address the unique challenges faced by modern organizations while providing measurable returns on investment.</p>
              
              <div className="benefits-grid">
                {programBenefits.map((benefit, index) => (
                  <div key={index} className="benefit-card">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="stats-section">
              <h2>The Impact of Workplace Mental Health</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">200M+</div>
                  <div className="stat-label">Workdays lost annually to depression in the U.S.</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">$193B</div>
                  <div className="stat-label">Annual cost to employers in lost productivity</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">76%</div>
                  <div className="stat-label">Employees who report workplace stress affects their health</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">4:1</div>
                  <div className="stat-label">Return on investment for mental wellness programs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'options' && (
          <div className="options-tab">
            <h2>Customizable Program Options</h2>
            <p>We offer flexible solutions tailored to your organization's size, industry, and specific needs.</p>
            
            <div className="programs-grid">
              {programOptions.map((program, index) => (
                <div key={index} className="program-card">
                  <h3>{program.title}</h3>
                  <p>{program.description}</p>
                  <div className="program-details">
                    <div className="detail">
                      <span className="label">Duration:</span>
                      <span className="value">{program.duration}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Format:</span>
                      <span className="value">{program.format}</span>
                    </div>
                  </div>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              ))}
            </div>

            <div className="custom-solutions">
              <h3>Need a Custom Solution?</h3>
              <p>We specialize in developing tailored programs for organizations with unique requirements. Our team will work with you to design initiatives that align with your company culture and goals.</p>
              <button className="custom-btn">Discuss Custom Options</button>
            </div>
          </div>
        )}

        {activeTab === 'success' && (
          <div className="success-tab">
            <h2>Proven Results Across Industries</h2>
            
            <div className="stories-grid">
              {successStories.map((story, index) => (
                <div key={index} className="story-card">
                  <div className="company-logo">
                    {story.company.charAt(0)}
                  </div>
                  <h3>{story.company}</h3>
                  <p className="result">{story.result}</p>
                  <p className="duration">{story.duration}</p>
                </div>
              ))}
            </div>

            <div className="case-studies">
              <h3>Detailed Case Studies</h3>
              <p>Explore in-depth analyses of how our programs have transformed workplace cultures and delivered measurable business outcomes.</p>
              <div className="case-study-list">
                <div className="case-item">
                  <h4>Tech Sector Transformation</h4>
                  <p>How we helped a 500-person tech company reduce burnout by 52%</p>
                  <a href="#" className="download-link">Download Case Study</a>
                </div>
                <div className="case-item">
                  <h4>Healthcare Provider Wellness</h4>
                  <p>Implementing sustainable mental health support for frontline workers</p>
                  <a href="#" className="download-link">Download Case Study</a>
                </div>
                <div className="case-item">
                  <h4>Manufacturing Mental Health</h4>
                  <p>Breaking stigma and building resilience in a traditional industry</p>
                  <a href="#" className="download-link">Download Case Study</a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'getstarted' && (
          <div className="getstarted-tab">
            <h2>Implementing Your Wellness Program</h2>
            
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Initial Consultation</h3>
                  <p>We learn about your organization, challenges, and goals through a comprehensive assessment.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Program Design</h3>
                  <p>Our experts create a customized wellness strategy aligned with your needs and budget.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Implementation</h3>
                  <p>We deploy the program with minimal disruption to your operations.</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Ongoing Support</h3>
                  <p>We provide continuous monitoring, adjustment, and reporting on program effectiveness.</p>
                </div>
              </div>
            </div>

            <div className="pricing-section">
              <h3>Transparent Pricing Models</h3>
              <p>We offer flexible pricing options to fit organizations of all sizes:</p>
              <div className="pricing-options">
                <div className="pricing-tier">
                  <h4>Small Teams</h4>
                  <div className="price">$99<span>/employee/year</span></div>
                  <ul>
                    <li>For companies with 10-50 employees</li>
                    <li>Basic workshop series</li>
                    <li>Quarterly check-ins</li>
                    <li>Online resource portal</li>
                  </ul>
                </div>
                <div className="pricing-tier">
                  <h4>Medium Organizations</h4>
                  <div className="price">$79<span>/employee/year</span></div>
                  <ul>
                    <li>For companies with 51-200 employees</li>
                    <li>Comprehensive program options</li>
                    <li>Manager training included</li>
                    <li>Monthly reporting</li>
                  </ul>
                </div>
                <div className="pricing-tier">
                  <h4>Enterprise Solutions</h4>
                  <div className="price">Custom Pricing</div>
                  <ul>
                    <li>For companies with 200+ employees</li>
                    <li>Fully customized programs</li>
                    <li>Dedicated account manager</li>
                    <li>Advanced analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3>Ready to Get Started?</h3>
              <p>Complete the form below and our corporate solutions team will contact you within 24 hours.</p>
              <form>
                <div className="form-row">
                  <input type="text" placeholder="Your Name" />
                  <input type="email" placeholder="Work Email" />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="Company Name" />
                  <input type="tel" placeholder="Phone Number" />
                </div>
                <div className="form-row">
                  <select>
                    <option>Company Size</option>
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                  <select>
                    <option>Industry</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                    <option>Manufacturing</option>
                    <option>Other</option>
                  </select>
                </div>
                <textarea placeholder="Tell us about your wellness goals or challenges"></textarea>
                <button type="submit" className="submit-btn">Submit Request</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorporateWellnessProgram;