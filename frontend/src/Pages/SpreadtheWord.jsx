import React, { useState } from 'react';
import './CSS/SpreadtheWord.css';

const SpreadTheWord = () => {
  const [activeTab, setActiveTab] = useState('social');

  return (
    <div className="spread-container">
      <div className="spread-hero">
        <h1>Spread the Word</h1>
        <p>Help us reach those who need support by sharing our resources</p>
      </div>

      <div className="spread-content">
        <div className="importance-section">
          <h2>Why Your Voice Matters</h2>
          <div className="importance-grid">
            <div className="importance-card">
              <div className="importance-icon">📢</div>
              <h3>Break the Stigma</h3>
              <p>Your sharing helps normalize conversations about mental health and reduces stigma.</p>
            </div>
            <div className="importance-card">
              <div className="importance-icon">🔍</div>
              <h3>Reach Those in Need</h3>
              <p>Many people don't know where to find help. Your share could be their lifeline.</p>
            </div>
            <div className="importance-card">
              <div className="importance-icon">❤️</div>
              <h3>Build Community</h3>
              <p>Create a network of support and awareness in your own community.</p>
            </div>
          </div>
        </div>

        <div className="sharing-options">
          <h2>Ways to Spread the Word</h2>
          <div className="tabs-container">
            <div className="tabs-header">
              <button 
                className={activeTab === 'social' ? 'tab-active' : ''} 
                onClick={() => setActiveTab('social')}
              >
                Social Media
              </button>
              <button 
                className={activeTab === 'community' ? 'tab-active' : ''} 
                onClick={() => setActiveTab('community')}
              >
                Community
              </button>
              <button 
                className={activeTab === 'digital' ? 'tab-active' : ''} 
                onClick={() => setActiveTab('digital')}
              >
                Digital Tools
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'social' && (
                <div className="tab-panel">
                  <h3>Share on Social Media</h3>
                  <div className="social-options">
                    <div className="social-option">
                      <h4>Ready-to-Share Posts</h4>
                      <p>Download our pre-made social media graphics and captions</p>
                      <button className="download-btn">Download Kit</button>
                    </div>
                    <div className="social-option">
                      <h4>Share Your Story</h4>
                      <p>Personal stories help reduce stigma. Share how mental health has affected your life.</p>
                      <button className="share-btn">Share Guidelines</button>
                    </div>
                    <div className="social-option">
                      <h4>Tag Us</h4>
                      <p>Use #FriendlyHelp and tag us in your mental health posts</p>
                      <div className="social-handles">
                        <span>@FriendlyHelpOfficial</span>
                        <span>@FriendlyHelp</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'community' && (
                <div className="tab-panel">
                  <h3>Community Outreach</h3>
                  <div className="community-options">
                    <div className="community-option">
                      <h4>Distribute Materials</h4>
                      <p>Place brochures and posters in local community centers, schools, and businesses</p>
                      <button className="request-btn">Request Materials</button>
                    </div>
                    <div className="community-option">
                      <h4>Organize an Event</h4>
                      <p>Host a mental health awareness event in your community</p>
                      <button className="event-btn">Event Toolkit</button>
                    </div>
                    <div className="community-option">
                      <h4>Start a Conversation</h4>
                      <p>Talk to friends, family, and colleagues about mental health resources</p>
                      <button className="convo-btn">Conversation Guide</button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'digital' && (
                <div className="tab-panel">
                  <h3>Digital Tools</h3>
                  <div className="digital-options">
                    <div className="digital-option">
                      <h4>Website Badge</h4>
                      <p>Add a FriendlyHelp supporter badge to your website or blog</p>
                      <button className="badge-btn">Get Code</button>
                    </div>
                    <div className="digital-option">
                      <h4>Email Signature</h4>
                      <p>Include our helpline information in your email signature</p>
                      <button className="email-btn">Copy Signature</button>
                    </div>
                    <div className="digital-option">
                      <h4>Virtual Events</h4>
                      <p>Share information about our services during online meetings and webinars</p>
                      <button className="virtual-btn">Presentation Slides</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="impact-section">
          <h2>The Impact of Sharing</h2>
          <div className="impact-infographic">
            <div className="infographic-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>You Share</h4>
                <p>You post about FriendlyHelp on your social media</p>
              </div>
            </div>
            <div className="infographic-arrow">→</div>
            <div className="infographic-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Someone Sees</h4>
                <p>A person in need sees your post</p>
              </div>
            </div>
            <div className="infographic-arrow">→</div>
            <div className="infographic-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>They Reach Out</h4>
                <p>They contact our helpline or use our resources</p>
              </div>
            </div>
            <div className="infographic-arrow">→</div>
            <div className="infographic-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Lives Change</h4>
                <p>They get the support they need to improve their mental health</p>
              </div>
            </div>
          </div>
        </div>

        <div className="resources-section">
          <h2>Sharing Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>Graphics & Images</h3>
              <p>Download ready-to-share social media graphics</p>
              <button className="resource-btn">Download</button>
            </div>
            <div className="resource-card">
              <h3>Printable Materials</h3>
              <p>Posters, brochures, and flyers for your community</p>
              <button className="resource-btn">Download</button>
            </div>
            <div className="resource-card">
              <h3>Email Templates</h3>
              <p>Pre-written emails to share with your network</p>
              <button className="resource-btn">View Templates</button>
            </div>
            <div className="resource-card">
              <h3>Statistics & Facts</h3>
              <p>Share accurate mental health information</p>
              <button className="resource-btn">Get Facts</button>
            </div>
          </div>
        </div>

        <div className="spread-cta">
          <h2>Ready to Make an Impact?</h2>
          <p>Join our ambassador program to get regular updates on how you can help spread the word</p>
          <div className="cta-actions">
            <button className="cta-btn-primary">Become an Ambassador</button>
            <button className="cta-btn-secondary">Download Resources</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadTheWord;