import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Users, Shield, Star } from 'lucide-react';
import './CSS/WhoWeAre.css';

const WhoWeAre = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "A Beacon of Hope",
      subtitle: "Your Light in the Darkness",
      content: "Every story matters. Every life has infinite value. At FriendlyHelp, we believe that behind every struggle is a person deserving of compassion, understanding, and unwavering support.",
      image: "/assets/hope-light.jpg",
      gradient: "from-purple-600 via-blue-600 to-teal-500"
    },
    {
      title: "Compassionate Hearts",
      subtitle: "Healing Through Connection",
      content: "We are more than counselors – we are listeners, friends, and fellow travelers on the journey of life. Our team understands that healing happens through genuine human connection.",
      image: "/assets/compassion.jpg",
      gradient: "from-rose-500 via-pink-500 to-purple-600"
    },
    {
      title: "Safe Haven",
      subtitle: "Your Sanctuary of Trust",
      content: "In a world that can feel overwhelming, we provide a sacred space where vulnerability is met with kindness, and every voice is heard without judgment.",
      image: "/assets/sanctuary.jpg",
      gradient: "from-emerald-500 via-teal-500 to-blue-600"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Unconditional Compassion",
      description: "We meet every person with genuine warmth and understanding, recognizing the courage it takes to reach out."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sacred Confidentiality",
      description: "Your privacy is paramount. We create a fortress of trust where your deepest concerns remain protected."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community of Care",
      description: "You're never alone. We're building a network of support that extends beyond crisis to lasting connection."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Hope Restoration",
      description: "We believe in the resilience of the human spirit and work tirelessly to help you rediscover your inner strength."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="who-we-are">
      {/* Hero Slider Section */}
      <div className="hero-slider">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className={`slide-background bg-gradient-to-br ${slide.gradient}`}>
                <div className="slide-content">
                  <div className="slide-text">
                    <h1 className="slide-title">{slide.title}</h1>
                    <h2 className="slide-subtitle">{slide.subtitle}</h2>
                    <p className="slide-description">{slide.content}</p>
                    <div className="slide-cta">
                      <button className="cta-button primary">Connect With Us</button>
                      <button className="cta-button secondary">Our Story</button>
                    </div>
                  </div>
                  <div className="slide-image">
                    <div className="image-placeholder">
                      <Heart className="placeholder-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="nav-button prev" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="nav-button next" onClick={nextSlide}>
          <ChevronRight />
        </button>
        
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">Our Journey of Compassion</h2>
              <div className="story-paragraphs">
                <p className="story-paragraph highlight">
                  FriendlyHelp was born from a simple yet profound belief: that no one should face their darkest moments alone. 
                  Our journey began when a group of mental health professionals, survivors, and compassionate individuals 
                  recognized the urgent need for accessible, judgment-free emotional support.
                </p>
                <p className="story-paragraph">
                  We've witnessed the transformative power of human connection – how a single conversation can shift 
                  perspective, how genuine listening can heal wounds, and how hope can be rekindled even in the deepest despair. 
                  Every day, we're reminded that behind every call for help is a precious life worth saving.
                </p>
                <p className="story-paragraph">
                  Today, FriendlyHelp stands as more than an organization – we are a community united by purpose, 
                  driven by compassion, and committed to ensuring that everyone who reaches out finds the support they need 
                  to not just survive, but thrive.
                </p>
              </div>
            </div>
            <div className="story-visual">
              <div className="visual-card floating">
                <div className="card-content">
                  <div className="metric">
                    <span className="number">24/7</span>
                    <span className="label">Always Here</span>
                  </div>
                </div>
              </div>
              <div className="visual-card floating delay-1">
                <div className="card-content">
                  <div className="metric">
                    <span className="number">∞</span>
                    <span className="label">Infinite Compassion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title centered">The Heart of Our Mission</h2>
          <p className="section-subtitle">
            These values guide every conversation, every moment of care, and every step we take together
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{'--delay': `${index * 0.2}s`}}>
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
                <div className="card-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Philosophy */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-content">
            <div className="philosophy-visual">
              <div className="visual-element circle-1"></div>
              <div className="visual-element circle-2"></div>
              <div className="visual-element circle-3"></div>
              <div className="central-message">
                <Heart className="heart-icon" />
                <span>Every Life Matters</span>
              </div>
            </div>
            <div className="philosophy-text">
              <h2 className="section-title">Our Philosophy of Care</h2>
              <div className="philosophy-points">
                <div className="philosophy-point">
                  <div className="point-marker"></div>
                  <div className="point-content">
                    <h4>Radical Acceptance</h4>
                    <p>We embrace you exactly as you are, without conditions or judgments</p>
                  </div>
                </div>
                <div className="philosophy-point">
                  <div className="point-marker"></div>
                  <div className="point-content">
                    <h4>Gentle Guidance</h4>
                    <p>We walk alongside you, offering support without pushing or rushing</p>
                  </div>
                </div>
                <div className="philosophy-point">
                  <div className="point-marker"></div>
                  <div className="point-content">
                    <h4>Endless Hope</h4>
                    <p>We hold hope for you, especially when you can't hold it for yourself</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">You Are Not Alone</h2>
            <p className="cta-subtitle">
              Whether you're struggling today or know someone who is, we're here. 
              Your story matters, your pain is valid, and help is always available.
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary large">Get Support Now</button>
              <button className="cta-button secondary large">Crisis Hotline</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;