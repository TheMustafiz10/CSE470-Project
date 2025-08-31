import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Target, Eye, Compass, Lightbulb, Globe, Users, Heart, Shield, Star, Zap } from 'lucide-react';
import './CSS/MissionandVision.css';

const MissionandVision = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const heroSlides = [
    {
      title: "Our Sacred Mission",
      subtitle: "Every Life Deserves Hope",
      content: "We exist to bridge the gap between despair and hope, offering immediate support and long-term healing to those who feel lost in their darkest moments.",
      icon: <Target className="w-16 h-16" />,
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
      title: "Our Visionary Future",
      subtitle: "A World Without Suffering in Silence",
      content: "We envision a world where mental health support is as accessible as calling a friend, where stigma dissolves into understanding, and where every person knows they matter.",
      icon: <Eye className="w-16 h-16" />,
      gradient: "from-emerald-500 via-teal-600 to-blue-700"
    },
    {
      title: "Our Guiding Purpose",
      subtitle: "Transforming Lives Through Connection",
      content: "We believe that healing happens in relationship, that hope is contagious, and that every conversation has the power to save a life and restore dignity.",
      icon: <Compass className="w-16 h-16" />,
      gradient: "from-orange-500 via-red-500 to-purple-600"
    }
  ];

  const missionPillars = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Immediate Response",
      description: "Providing crisis intervention and emotional support whenever and wherever it's needed, 24/7.",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe Sanctuary",
      description: "Creating judgment-free spaces where vulnerability is met with compassion and understanding.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Building",
      description: "Fostering connections that extend beyond crisis to create lasting networks of support and belonging.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Education & Awareness",
      description: "Breaking stigma through education, advocacy, and sharing stories of hope and recovery.",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const visionElements = [
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Global Accessibility",
      description: "Mental health support that transcends borders, languages, and socioeconomic barriers",
      statistic: "Available in 50+ languages",
      delay: "0s"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Instant Connection",
      description: "Technology-enabled support that connects people to help within seconds, not days",
      statistic: "< 30 second response time",
      delay: "0.2s"
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "Preventive Care",
      description: "Proactive mental wellness programs that build resilience before crisis strikes",
      statistic: "Preventing 1M+ crises annually",
      delay: "0.4s"
    }
  ];

  const impactGoals = [
    { number: "1M+", label: "Lives Touched", description: "Direct support and intervention" },
    { number: "24/7", label: "Always Available", description: "Round-the-clock crisis support" },
    { number: "100%", label: "Confidential", description: "Safe, judgment-free conversations" },
    { number: "∞", label: "Hope Restored", description: "Infinite capacity for compassion" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="mission-vision">
      {/* Hero Slider Section */}
      <div className="hero-slider-mv">
        <div className="slider-container-mv">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`slide-mv ${index === currentSlide ? 'active' : ''}`}
            >
              <div className={`slide-background-mv bg-gradient-to-br ${slide.gradient}`}>
                <div className="slide-content-mv">
                  <div className="slide-icon-mv">
                    {slide.icon}
                  </div>
                  <h1 className="slide-title-mv">{slide.title}</h1>
                  <h2 className="slide-subtitle-mv">{slide.subtitle}</h2>
                  <p className="slide-description-mv">{slide.content}</p>
                  <div className="slide-cta-mv">
                    <button className="cta-btn-mv primary">Learn More</button>
                    <button className="cta-btn-mv secondary">Get Involved</button>
                  </div>
                </div>
                <div className="slide-decoration">
                  <div className="floating-element element-1"></div>
                  <div className="floating-element element-2"></div>
                  <div className="floating-element element-3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="nav-btn-mv prev" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="nav-btn-mv next" onClick={nextSlide}>
          <ChevronRight />
        </button>
        
        <div className="slider-dots-mv">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot-mv ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Mission Deep Dive */}
      <section className="mission-section">
        <div className="container-mv">
          <div className="section-header">
            <div className="section-icon">
              <Target className="w-12 h-12" />
            </div>
            <h2 className="section-title-mv">Our Mission: A Beacon in the Storm</h2>
            <p className="section-subtitle-mv">
              Every day, someone makes the brave decision to reach out for help. Our mission is to ensure 
              that when they do, they find not just answers, but authentic human connection and unwavering support.
            </p>
          </div>

          <div className="mission-statement">
            <div className="statement-content">
              <blockquote className="mission-quote">
                "To provide immediate, compassionate, and accessible mental health support to anyone experiencing 
                emotional distress, suicidal thoughts, or feelings of hopelessness, while working tirelessly to 
                create a world where seeking help is seen as an act of courage, not weakness."
              </blockquote>
              <div className="quote-author">— FriendlyHelp Mission Statement</div>
            </div>
          </div>

          <div className="pillars-grid">
            {missionPillars.map((pillar, index) => (
              <div key={index} className="pillar-card" style={{'--index': index}}>
                <div className={`pillar-icon bg-gradient-to-r ${pillar.color}`}>
                  {pillar.icon}
                </div>
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-description">{pillar.description}</p>
                <div className="pillar-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section" ref={sectionRef}>
        <div className="container-mv">
          <div className="section-header">
            <div className="section-icon">
              <Eye className="w-12 h-12" />
            </div>
            <h2 className="section-title-mv">Our Vision: The Future We're Building</h2>
            <p className="section-subtitle-mv">
              We see a tomorrow where mental health support is as natural and accessible as breathing, 
              where stigma has been replaced by understanding, and where no one suffers in silence.
            </p>
          </div>

          <div className="vision-elements">
            {visionElements.map((element, index) => (
              <div 
                key={index} 
                className={`vision-card ${isVisible ? 'animate' : ''}`}
                style={{'--delay': element.delay}}
              >
                <div className="vision-icon">
                  {element.icon}
                </div>
                <div className="vision-content">
                  <h3 className="vision-title">{element.title}</h3>
                  <p className="vision-description">{element.description}</p>
                  <div className="vision-stat">{element.statistic}</div>
                </div>
                <div className="vision-card-glow"></div>
              </div>
            ))}
          </div>

          <div className="vision-statement">
            <div className="statement-wrapper">
              <h3 className="vision-heading">A World Transformed</h3>
              <p className="vision-text">
                Imagine a world where asking for help is celebrated as wisdom, where mental health 
                resources are as ubiquitous as streetlights, and where every person knows with absolute 
                certainty that their life has value and meaning. This is the world we're creating, 
                one conversation at a time.
              </p>
              <div className="vision-highlights">
                <div className="highlight-item">
                  <span className="highlight-number">Zero</span>
                  <span className="highlight-text">Lives Lost to Preventable Suicide</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-number">100%</span>
                  <span className="highlight-text">Access to Mental Health Support</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-number">Global</span>
                  <span className="highlight-text">Community of Care and Understanding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="impact-section">
        <div className="container-mv">
          <h2 className="section-title-mv centered">Our Commitment to Impact</h2>
          <p className="section-subtitle-mv centered">
            These aren't just numbers—they represent real lives, real hope, and real transformation
          </p>
          
          <div className="impact-grid">
            {impactGoals.map((goal, index) => (
              <div key={index} className="impact-card" style={{'--delay': `${index * 0.1}s`}}>
                <div className="impact-number">{goal.number}</div>
                <div className="impact-label">{goal.label}</div>
                <div className="impact-description">{goal.description}</div>
                <div className="impact-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section-mv">
        <div className="container-mv">
          <div className="cta-content-mv">
            <div className="cta-visual">
              <div className="cta-circle circle-1"></div>
              <div className="cta-circle circle-2"></div>
              <div className="cta-circle circle-3"></div>
              <div className="cta-center">
                <Heart className="cta-heart" />
              </div>
            </div>
            <div className="cta-text">
              <h2 className="cta-title-mv">Be Part of Something Greater</h2>
              <p className="cta-subtitle-mv">
                Our mission and vision come alive through people like you—those who believe in the power of 
                compassion and the possibility of a better tomorrow. Whether you need support or want to provide it, 
                you have a place in our community.
              </p>
              <div className="cta-buttons-mv">
                <button className="cta-btn-mv primary large">Get Support Now</button>
                <button className="cta-btn-mv secondary large">Volunteer With Us</button>
                <button className="cta-btn-mv tertiary large">Share Our Mission</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionandVision;