import React, { useState } from 'react';
import './CSS/FAQ.css';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = {
    general: [
      {
        id: 1,
        question: "What is FriendlyHelp?",
        answer: "FriendlyHelp is a mental health support platform providing emotional support, crisis intervention, and resources for those experiencing mental health challenges, loneliness, or suicidal thoughts. We offer a helpline, online resources, and community support programs."
      },
      {
        id: 2,
        question: "Is FriendlyHelp free to use?",
        answer: "Yes, all of our services are completely free. We believe that mental health support should be accessible to everyone regardless of their financial situation."
      },
      {
        id: 3,
        question: "Who operates FriendlyHelp?",
        answer: "FriendlyHelp is operated by licensed mental health professionals, trained volunteers, and support staff who are dedicated to providing compassionate care and support to those in need."
      },
      {
        id: 4,
        question: "How is FriendlyHelp funded?",
        answer: "We are funded through grants, donations, and community partnerships. We maintain strict confidentiality and do not sell user data or information to third parties."
      }
    ],
    helpline: [
      {
        id: 1,
        question: "What can I expect when I call the helpline?",
        answer: "When you call our helpline, you'll be connected with a trained volunteer who will listen compassionately without judgment. They will provide emotional support, help you explore coping strategies, and if needed, direct you to additional resources. Calls typically last 20-45 minutes."
      },
      {
        id: 2,
        question: "Is the helline available 24/7?",
        answer: "Yes, our helpline is available 24 hours a day, 7 days a week, including holidays. You can call anytime you need support."
      },
      {
        id: 3,
        question: "Is the helpline confidential?",
        answer: "Yes, all conversations with our helpline volunteers are confidential. The only exception would be if we believe there is immediate risk of harm to yourself or others, in which case we may need to contact emergency services."
      },
      {
        id: 4,
        question: "What if I'm not in crisis but just need someone to talk to?",
        answer: "Our helpline is for anyone needing emotional support, not just those in immediate crisis. Whether you're feeling lonely, stressed, anxious, or just need to talk, our volunteers are here to listen."
      }
    ],
    resources: [
      {
        id: 1,
        question: "How often are new resources added to the website?",
        answer: "We add new resources weekly, including articles, worksheets, and recommended tools. Our content is regularly reviewed and updated to ensure it reflects current best practices in mental health support."
      },
      {
        id: 2,
        question: "Can I suggest a topic for a resource?",
        answer: "Absolutely! We welcome suggestions for new resources. Please use our contact form to share your ideas for topics that would be helpful to you and others."
      },
      {
        id: 3,
        question: "Are your resources evidence-based?",
        answer: "Yes, all our resources are developed in consultation with mental health professionals and based on current research and evidence-based practices in psychology and counseling."
      },
      {
        id: 4,
        question: "Can I share your resources with others?",
        answer: "Please do! We encourage sharing our resources with anyone who might benefit from them. Many of our materials are specifically designed for sharing in communities, schools, and workplaces."
      }
    ],
    volunteering: [
      {
        id: 1,
        question: "How can I become a volunteer?",
        answer: "We have several volunteer opportunities available. The process typically includes an application, interview, background check, and comprehensive training program. Visit our Volunteer page to learn more and apply."
      },
      {
        id: 2,
        question: "Do I need prior experience to volunteer?",
        answer: "No prior experience is necessary for many of our volunteer roles. We provide extensive training to prepare volunteers for their roles. The most important qualifications are empathy, good listening skills, and a commitment to helping others."
      },
      {
        id: 3,
        question: "What is the time commitment for volunteers?",
        answer: "Time commitments vary by role. Helpline volunteers typically commit to 4-6 hours per week, while other roles may have more flexible arrangements. We work with volunteers to find schedules that work for them."
      },
      {
        id: 4,
        question: "Do you offer volunteer training?",
        answer: "Yes, we provide comprehensive training for all volunteer roles. Training includes crisis intervention techniques, active listening skills, boundary setting, and specific protocols for different situations. Training is both online and in-person where available."
      }
    ]
  };

  const currentQuestions = faqData[activeCategory];

  return (
    <div className="faq-container">
      <div className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our services and support options</p>
      </div>

      <div className="faq-content">
        <div className="faq-intro">
          <h2>How Can We Help You?</h2>
          <p>We've compiled answers to the questions we hear most often. If you don't find what you're looking for, please don't hesitate to contact us directly.</p>
        </div>

        <div className="faq-categories">
          <div className="category-buttons">
            <button 
              className={activeCategory === 'general' ? 'active' : ''} 
              onClick={() => setActiveCategory('general')}
            >
              General
            </button>
            <button 
              className={activeCategory === 'helpline' ? 'active' : ''} 
              onClick={() => setActiveCategory('helpline')}
            >
              Helpline
            </button>
            <button 
              className={activeCategory === 'resources' ? 'active' : ''} 
              onClick={() => setActiveCategory('resources')}
            >
              Resources
            </button>
            <button 
              className={activeCategory === 'volunteering' ? 'active' : ''} 
              onClick={() => setActiveCategory('volunteering')}
            >
              Volunteering
            </button>
          </div>
        </div>

        <div className="faq-questions">
          <h3>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Questions</h3>
          <div className="questions-list">
            {currentQuestions.map(item => (
              <div key={item.id} className="faq-item">
                <button 
                  className="faq-question" 
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={openItems[item.id] || false}
                >
                  {item.question}
                  <span className="toggle-icon">{openItems[item.id] ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openItems[item.id] ? 'open' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-prompt">
          <h2>Still Have Questions?</h2>
          <p>We're here to help. Contact our support team for additional information or assistance.</p>
          <div className="contact-options">
            <div className="contact-option">
              <h4>Email Us</h4>
              <p>Send us a message and we'll respond within 24 hours</p>
              <a href="mailto:support@friendlyhelp.org" className="contact-link">support@friendlyhelp.org</a>
            </div>
            <div className="contact-option">
              <h4>Call Us</h4>
              <p>Speak directly with our support team during business hours</p>
              <a href="tel:1-800-123-4567" className="contact-link">1-800-123-4567</a>
            </div>
            <div className="contact-option">
              <h4>Live Chat</h4>
              <p>Chat with us in real-time during business hours</p>
              <button className="chat-btn">Start Chat</button>
            </div>
          </div>
        </div>

        <div className="emergency-notice">
          <h3>In Crisis? Need Immediate Help?</h3>
          <p>If you or someone you know is in immediate danger, please call emergency services or our 24/7 crisis helpline:</p>
          <div className="crisis-number">1-800-273-8255</div>
          <p>Our trained crisis counselors are available anytime to provide support.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;