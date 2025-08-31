import React from 'react';
import './CSS/NonHelplineVolunteer.css';

const NonHelplineVolunteer = () => {
  return (
    <div className="nonhl-volunteer-container">
      <div className="nonhl-volunteer-hero">
        <h1>Non-Helpline Volunteer Opportunities</h1>
        <p>Support our mission behind the scenes with your unique skills and talents</p>
      </div>

      <div className="nonhl-volunteer-content">
        <div className="role-categories">
          <h2>Ways to Get Involved</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">📝</div>
              <h3>Content Creation</h3>
              <p>Help create supportive resources, blog posts, and educational materials</p>
              <ul>
                <li>Writing mental health articles</li>
                <li>Designing informational graphics</li>
                <li>Developing self-help resources</li>
              </ul>
            </div>
            <div className="category-card">
              <div className="category-icon">📱</div>
              <h3>Digital Support</h3>
              <p>Leverage your tech skills to expand our reach and impact</p>
              <ul>
                <li>Social media management</li>
                <li>Website maintenance</li>
                <li>App development</li>
              </ul>
            </div>
            <div className="category-card">
              <div className="category-icon">🎨</div>
              <h3>Creative Arts</h3>
              <p>Use artistic expression to promote mental health awareness</p>
              <ul>
                <li>Creating inspirational content</li>
                <li>Designing campaign materials</li>
                <li>Producing educational videos</li>
              </ul>
            </div>
            <div className="category-card">
              <div className="category-icon">📊</div>
              <h3>Administrative Support</h3>
              <p>Help keep our operations running smoothly</p>
              <ul>
                <li>Data entry and management</li>
                <li>Grant writing assistance</li>
                <li>Event coordination</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="skills-match">
          <h2>Match Your Skills to Our Needs</h2>
          <div className="skills-container">
            <div className="skills-list">
              <h3>We're Looking For:</h3>
              <div className="skill-tags">
                <span className="skill-tag">Writing/Editing</span>
                <span className="skill-tag">Graphic Design</span>
                <span className="skill-tag">Social Media</span>
                <span className="skill-tag">Video Production</span>
                <span className="skill-tag">Web Development</span>
                <span className="skill-tag">Data Analysis</span>
                <span className="skill-tag">Event Planning</span>
                <span className="skill-tag">Research</span>
                <span className="skill-tag">Translation</span>
                <span className="skill-tag">Fundraising</span>
              </div>
            </div>
            <div className="skills-cta">
              <p>Don't see your skill listed? We'd still love to hear from you!</p>
              <button className="skills-button">Share Your Skills</button>
            </div>
          </div>
        </div>

        <div className="flexibility-section">
          <h2>Flexible Volunteering</h2>
          <div className="flexibility-content">
            <div className="flexibility-text">
              <h3>Volunteer on Your Terms</h3>
              <p>We understand that everyone has different availability and commitments. Our non-helpline opportunities offer:</p>
              <ul>
                <li>Remote volunteering options</li>
                <li>Flexible scheduling</li>
                <li>Project-based commitments</li>
                <li>Short-term and long-term opportunities</li>
              </ul>
            </div>
            <div className="flexibility-image">
              <div className="placeholder-image">⏰</div>
            </div>
          </div>
        </div>

        <div className="impact-stats">
          <h2>Your Impact Behind the Scenes</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Resources Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">85%</div>
              <div className="stat-label">Increase in Reach</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200K</div>
              <div className="stat-label">People Reached Online</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">40%</div>
              <div className="stat-label">Cost Savings</div>
            </div>
          </div>
        </div>

        <div className="nonhl-cta">
          <h2>Your Skills Can Change Lives</h2>
          <p>Join our team of behind-the-scenes heroes who make our helpline services possible</p>
          <div className="cta-buttons">
            <button className="primary-cta">Apply to Volunteer</button>
            <button className="secondary-cta">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonHelplineVolunteer;