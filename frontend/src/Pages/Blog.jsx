import React, { useState } from 'react';
import './CSS/Blog.css';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "Understanding Anxiety: More Than Just Worry",
      category: "mental-health",
      date: "March 15, 2023",
      excerpt: "Anxiety disorders are among the most common mental health conditions, affecting millions worldwide. Learn about the different types, symptoms, and evidence-based treatments.",
      author: "Dr. Emily Chen",
      readTime: "5 min read",
      image: "/blog/anxiety-article.jpg"
    },
    {
      id: 2,
      title: "5 Practical Self-Care Strategies for Stressful Times",
      category: "self-care",
      date: "February 28, 2023",
      excerpt: "When life gets overwhelming, having a toolkit of self-care practices can make all the difference. Discover actionable strategies you can implement today.",
      author: "Sarah Johnson",
      readTime: "4 min read",
      image: "/blog/self-care-strategies.jpg"
    },
    {
      id: 3,
      title: "How to Support a Loved One with Depression",
      category: "support",
      date: "February 15, 2023",
      excerpt: "Supporting someone with depression can be challenging. Learn effective ways to provide meaningful support while maintaining your own wellbeing.",
      author: "Michael Roberts",
      readTime: "7 min read",
      image: "/blog/supporting-depression.jpg"
    },
    {
      id: 4,
      title: "The Science Behind Mindfulness Meditation",
      category: "techniques",
      date: "January 30, 2023",
      excerpt: "Research continues to reveal how mindfulness practices physically change the brain and improve mental health. Explore the neuroscience behind meditation.",
      author: "Dr. Lisa Park",
      readTime: "6 min read",
      image: "/blog/mindfulness-science.jpg"
    },
    {
      id: 5,
      title: "Breaking the Stigma: Talking Openly About Mental Health",
      category: "awareness",
      date: "January 18, 2023",
      excerpt: "Stigma remains a significant barrier to mental health care. Learn how open conversations can create change in your community.",
      author: "Alex Morgan",
      readTime: "5 min read",
      image: "/blog/breaking-stigma.jpg"
    },
    {
      id: 6,
      title: "Coping with Grief and Loss",
      category: "mental-health",
      date: "January 5, 2023",
      excerpt: "Grief is a natural response to loss, but it can be overwhelming. Understanding the grieving process can help you navigate this difficult journey.",
      author: "Dr. James Wilson",
      readTime: "8 min read",
      image: "/blog/coping-grief.jpg"
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="blog-container">
      <div className="blog-hero">
        <h1>FriendlyHelp Blog</h1>
        <p>Evidence-based insights, personal stories, and practical advice for mental wellbeing</p>
      </div>

      <div className="blog-content">
        <div className="featured-post">
          <div className="featured-image">
            <img src="/blog/featured-article.jpg" alt="Featured blog post" />
          </div>
          <div className="featured-content">
            <span className="featured-badge">Featured Post</span>
            <h2>The Connection Between Physical and Mental Health</h2>
            <p>Exploring how exercise, nutrition, and sleep directly impact our mental wellbeing and what the research tells us about integrated health approaches.</p>
            <div className="post-meta">
              <span className="author">By Dr. Rachel Kim</span>
              <span className="date">April 2, 2023</span>
              <span className="read-time">6 min read</span>
            </div>
            <button className="read-more-btn">Read Article</button>
          </div>
        </div>

        <div className="blog-categories">
          <h2>Explore Topics</h2>
          <div className="category-buttons">
            <button 
              className={activeCategory === 'all' ? 'active' : ''} 
              onClick={() => setActiveCategory('all')}
            >
              All Topics
            </button>
            <button 
              className={activeCategory === 'mental-health' ? 'active' : ''} 
              onClick={() => setActiveCategory('mental-health')}
            >
              Mental Health
            </button>
            <button 
              className={activeCategory === 'self-care' ? 'active' : ''} 
              onClick={() => setActiveCategory('self-care')}
            >
              Self-Care
            </button>
            <button 
              className={activeCategory === 'support' ? 'active' : ''} 
              onClick={() => setActiveCategory('support')}
            >
              Supporting Others
            </button>
            <button 
              className={activeCategory === 'techniques' ? 'active' : ''} 
              onClick={() => setActiveCategory('techniques')}
            >
              Techniques
            </button>
            <button 
              className={activeCategory === 'awareness' ? 'active' : ''} 
              onClick={() => setActiveCategory('awareness')}
            >
              Awareness
            </button>
          </div>
        </div>

        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="post-content">
                <span className="post-category">{post.category.replace('-', ' ')}</span>
                <h3>{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span className="author">By {post.author}</span>
                  <span className="date">{post.date}</span>
                  <span className="read-time">{post.readTime}</span>
                </div>
                <button className="read-post-btn">Read More</button>
              </div>
            </div>
          ))}
        </div>

        <div className="newsletter-section">
          <h2>Stay Updated with Our Latest Content</h2>
          <p>Subscribe to our newsletter for new articles, resources, and mental health tips delivered to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
          <p className="privacy-note">We respect your privacy and will never share your information.</p>
        </div>

        <div className="popular-topics">
          <h2>Popular Topics</h2>
          <div className="topics-grid">
            <div className="topic-card">
              <h3>Anxiety Management</h3>
              <p>12 articles</p>
            </div>
            <div className="topic-card">
              <h3>Mindfulness</h3>
              <p>8 articles</p>
            </div>
            <div className="topic-card">
              <h3>Depression</h3>
              <p>10 articles</p>
            </div>
            <div className="topic-card">
              <h3>Relationships</h3>
              <p>7 articles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;