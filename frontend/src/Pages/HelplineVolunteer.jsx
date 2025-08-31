import React from 'react';
import './CSS/HelplineVolunteer.css';

const HelplineVolunteer = () => {
  return (
    <div className="volunteer-container">
      <div className="volunteer-hero">
        <h1>Helpline Volunteer</h1>
        <p>Be the voice of hope for those in need of immediate emotional support</p>
      </div>

      <div className="volunteer-content">
        <div className="volunteer-benefits">
          <h2>Why Become a Helpline Volunteer?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💖</div>
              <h3>Make a Direct Impact</h3>
              <p>Provide immediate support to individuals in crisis and be their lifeline during difficult moments.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3>Personal Growth</h3>
              <p>Develop active listening skills, empathy, and emotional intelligence that benefit all areas of life.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Join a Community</h3>
              <p>Become part of a supportive network of like-minded individuals dedicated to mental health advocacy.</p>
            </div>
          </div>
        </div>

        <div className="volunteer-requirements">
          <h2>What We Look For</h2>
          <div className="requirements-list">
            <div className="requirement-item">
              <span className="checkmark">✓</span>
              <p>Empathetic listening skills</p>
            </div>
            <div className="requirement-item">
              <span className="checkmark">✓</span>
              <p>Commitment to 4-6 hours per week</p>
            </div>
            <div className="requirement-item">
              <span className="checkmark">✓</span>
              <p>Completion of our 40-hour training program</p>
            </div>
            <div className="requirement-item">
              <span className="checkmark">✓</span>
              <p>Ability to remain calm under pressure</p>
            </div>
            <div className="requirement-item">
              <span className="checkmark">✓</span>
              <p>Respect for confidentiality and privacy</p>
            </div>
          </div>
        </div>

        <div className="training-process">
          <h2>Our Training Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Application Screening</h3>
              <p>Complete our online application and preliminary interview</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Core Training</h3>
              <p>40 hours of comprehensive crisis intervention training</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Supervised Practice</h3>
              <p>Hands-on experience with mentor guidance</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Certification</h3>
              <p>Become a certified FriendlyHelp helpline volunteer</p>
            </div>
          </div>
        </div>

        <div className="volunteer-testimonials">
          <h2>Stories From Our Volunteers</h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <p className="testimonial-text">"Volunteering with FriendlyHelp has been one of the most rewarding experiences of my life. Knowing I've made a difference in someone's darkest moment is priceless."</p>
              <p className="testimonial-author">- Maria, Volunteer for 2 years</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">"The training prepared me for situations I never thought I could handle. The ongoing support from the team makes me feel confident in my ability to help others."</p>
              <p className="testimonial-author">- James, Volunteer for 1 year</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join our team of dedicated helpline volunteers and provide critical support to those in need.</p>
          <button className="cta-button">Apply Now</button>
          <p className="cta-note">Have questions? Attend our monthly information session every first Tuesday at 6 PM.</p>
        </div>
      </div>
    </div>
  );
};

export default HelplineVolunteer;