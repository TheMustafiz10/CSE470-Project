import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './CSS/TrainingsandWorkshops.css';

const TrainingsandWorkshops = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const workshops = [
    {
      id: 1,
      title: "Mental Health First Aid",
      category: "professional",
      date: "2023-11-15",
      duration: "2 days",
      image: "/assets/mental-health-first-aid.jpg",
      description: "Learn how to identify, understand and respond to signs of mental health and substance use challenges."
    },
    {
      id: 2,
      title: "Coping with Anxiety",
      category: "public",
      date: "2023-11-20",
      duration: "3 hours",
      image: "/assets/coping-with-anxiety.jpg",
      description: "Practical techniques to manage anxiety and stress in daily life."
    },
    {
      id: 3,
      title: "Suicide Prevention Gatekeeper",
      category: "professional",
      date: "2023-11-25",
      duration: "1 day",
      image: "/assets/suicide-prevention.jpg",
      description: "Training for identifying at-risk individuals and connecting them with appropriate resources."
    },
    {
      id: 4,
      title: "Mindfulness Meditation",
      category: "public",
      date: "2023-12-01",
      duration: "2 hours",
      image: "/assets/mindfulness.jpg",
      description: "Learn mindfulness techniques to improve mental wellbeing and reduce stress."
    },
    {
      id: 5,
      title: "Youth Mental Health",
      category: "youth",
      date: "2023-12-05",
      duration: "1 day",
      image: "/assets/youth-mental-health.jpg",
      description: "Specialized training for supporting mental health in children and adolescents."
    }
  ];

  const filteredWorkshops = activeCategory === 'all' 
    ? workshops 
    : workshops.filter(workshop => workshop.category === activeCategory);

  return (
    <div className="trainings-container">
      <div className="trainings-hero">
        <h1>Training & Workshops</h1>
        <p>Empowering individuals and communities through education and skill-building for mental health support.</p>
      </div>

      <div className="category-filter">
        <button 
          className={activeCategory === 'all' ? 'active' : ''} 
          onClick={() => setActiveCategory('all')}
        >
          All Workshops
        </button>
        <button 
          className={activeCategory === 'professional' ? 'active' : ''} 
          onClick={() => setActiveCategory('professional')}
        >
          Professional Training
        </button>
        <button 
          className={activeCategory === 'public' ? 'active' : ''} 
          onClick={() => setActiveCategory('public')}
        >
          Public Workshops
        </button>
        <button 
          className={activeCategory === 'youth' ? 'active' : ''} 
          onClick={() => setActiveCategory('youth')}
        >
          Youth Programs
        </button>
      </div>

      <div className="featured-slider">
        <h2>Featured Workshops</h2>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {workshops.slice(0, 3).map(workshop => (
            <SwiperSlide key={workshop.id}>
              <div className="slider-content">
                <div className="slider-text">
                  <h3>{workshop.title}</h3>
                  <p>{workshop.description}</p>
                  <div className="workshop-details">
                    <span className="date">{workshop.date}</span>
                    <span className="duration">{workshop.duration}</span>
                  </div>
                  <button className="register-btn">Register Now</button>
                </div>
                <div className="slider-image">
                  <img src={workshop.image} alt={workshop.title} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="workshops-grid">
        <h2>Upcoming Workshops</h2>
        <div className="grid-container">
          {filteredWorkshops.map(workshop => (
            <div key={workshop.id} className="workshop-card">
              <div className="card-image">
                <img src={workshop.image} alt={workshop.title} />
                <span className="category-badge">{workshop.category}</span>
              </div>
              <div className="card-content">
                <h3>{workshop.title}</h3>
                <p>{workshop.description}</p>
                <div className="card-details">
                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span className="value">{workshop.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">{workshop.duration}</span>
                  </div>
                </div>
                <button className="card-btn">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="training-benefits">
        <h2>Benefits of Our Training Programs</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">📚</div>
            <h3>Evidence-Based</h3>
            <p>Our programs are developed based on the latest research in mental health.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">👥</div>
            <h3>Expert Facilitators</h3>
            <p>Learn from experienced mental health professionals and educators.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔄</div>
            <h3>Practical Skills</h3>
            <p>Gain actionable techniques you can apply immediately in your daily life.</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🤝</div>
            <h3>Community Building</h3>
            <p>Connect with others who share your interest in mental health support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingsandWorkshops;