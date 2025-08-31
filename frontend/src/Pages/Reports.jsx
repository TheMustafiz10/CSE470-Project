
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Download, FileText, Calendar, Users,
  TrendingUp, BookOpen, Search, Filter, Eye, Share, Star, Award
} from 'lucide-react';
import './CSS/Reports.css';

const Reports = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredReports, setFeaturedReports] = useState([]);

  // SLIDES
  const heroSlides = [
    {
      title: "Evidence-Based Impact",
      subtitle: "Research That Saves Lives",
      content: "Our commitment to evidence-based practices drives everything we do. Explore groundbreaking research, compelling statistics, and real-world impact data that demonstrates the power of compassionate mental health intervention.",
      icon: <TrendingUp className="w-16 h-16" />,
      gradient: "from-blue-600 via-indigo-600 to-purple-700"
    },
    {
      title: "Global Mental Health Data",
      subtitle: "Understanding the Crisis",
      content: "Knowledge is power in the fight against suicide and mental health stigma. Our comprehensive collection of research papers, studies, and reports provides crucial insights into prevention strategies and intervention effectiveness.",
      icon: <BookOpen className="w-16 h-16" />,
      gradient: "from-emerald-500 via-teal-600 to-blue-700"
    },
    {
      title: "Community Impact Stories",
      subtitle: "Measuring Hope & Healing",
      content: "Numbers tell stories of transformation. Discover how evidence-based approaches, community engagement, and accessible mental health resources are creating measurable change in communities worldwide.",
      icon: <Award className="w-16 h-16" />,
      gradient: "from-orange-500 via-red-500 to-pink-600"
    }
  ];

  // PAPERS
  const researchPapers = [
    {
      id: 1,
      title: "The Effectiveness of 24/7 Crisis Hotlines in Suicide Prevention: A Meta-Analysis",
      authors: "Dr. Sarah Johnson, Dr. Michael Chen, Dr. Emma Rodriguez",
      journal: "Journal of Crisis Intervention",
      year: 2024,
      category: "crisis-intervention",
      abstract: "This comprehensive meta-analysis examines the effectiveness of round-the-clock crisis hotlines in preventing suicide attempts and completions across diverse populations...",
      downloads: 2847,
      citations: 156,
      impact: "high",
      tags: ["suicide prevention", "crisis intervention", "hotlines", "meta-analysis"],
      pdfUrl: "/assets/reports/crisis-hotlines-effectiveness-2024.pdf"
    },
    {
      id: 2,
      title: "Digital Mental Health Interventions: Bridging Accessibility Gaps in Underserved Communities",
      authors: "Dr. Lisa Park, Dr. David Thompson, Dr. Maria Santos",
      journal: "Digital Health & Society",
      year: 2024,
      category: "digital-health",
      abstract: "An exploration of how digital platforms and mobile applications are revolutionizing mental health access, particularly in rural and economically disadvantaged areas...",
      downloads: 1923,
      citations: 89,
      impact: "medium",
      tags: ["digital health", "accessibility", "mobile apps", "rural communities"],
      pdfUrl: "/assets/reports/digital-mental-health-2024.pdf"
    },
    {
      id: 3,
      title: "Peer Support Models in Mental Health Recovery: Long-term Outcomes and Best Practices",
      authors: "Dr. Robert Kim, Dr. Jennifer Walsh, Dr. Ahmed Hassan",
      journal: "Community Mental Health Review",
      year: 2023,
      category: "peer-support",
      abstract: "This longitudinal study tracks the recovery outcomes of individuals participating in peer support programs over a 5-year period, identifying key factors for success...",
      downloads: 3156,
      citations: 234,
      impact: "high",
      tags: ["peer support", "recovery", "community health", "longitudinal study"],
      pdfUrl: "/assets/reports/peer-support-outcomes-2023.pdf"
    },
    {
      id: 4,
      title: "Cultural Competency in Suicide Prevention: Adapting Interventions for Diverse Populations",
      authors: "Dr. Priya Patel, Dr. Carlos Mendoza, Dr. Fatima Al-Rashid",
      journal: "Cross-Cultural Psychology in Practice",
      year: 2024,
      category: "cultural-competency",
      abstract: "An examination of how cultural factors influence suicide risk and the effectiveness of culturally adapted prevention strategies across different ethnic and religious groups...",
      downloads: 1567,
      citations: 78,
      impact: "medium",
      tags: ["cultural competency", "diversity", "prevention strategies", "ethnic groups"],
      pdfUrl: "/assets/reports/cultural-competency-2024.pdf"
    },
    {
      id: 5,
      title: "The Role of Social Media in Mental Health Awareness and Crisis Detection",
      authors: "Dr. Alex Morgan, Dr. Sophie Chen, Dr. James Wilson",
      journal: "Technology & Mental Health",
      year: 2024,
      category: "technology",
      abstract: "Investigating how artificial intelligence and machine learning algorithms can identify at-risk individuals through social media patterns and provide early intervention...",
      downloads: 2234,
      citations: 112,
      impact: "high",
      tags: ["social media", "AI", "crisis detection", "early intervention"],
      pdfUrl: "/assets/reports/social-media-mental-health-2024.pdf"
    },
    {
      id: 6,
      title: "Economic Impact of Suicide Prevention Programs: A Cost-Benefit Analysis",
      authors: "Dr. Margaret Foster, Dr. Thomas Lee, Dr. Rachel Green",
      journal: "Health Economics Quarterly",
      year: 2023,
      category: "economics",
      abstract: "A comprehensive economic analysis demonstrating the financial benefits of investing in suicide prevention programs, including healthcare cost savings and productivity gains...",
      downloads: 1789,
      citations: 145,
      impact: "high",
      tags: ["economics", "cost-benefit", "healthcare", "policy"],
      pdfUrl: "/assets/reports/economic-impact-prevention-2023.pdf"
    }
  ];

  const impactStats = [
    { number: "847", label: "Research Papers", description: "Comprehensive studies and reports" },
    { number: "2.3M", label: "Downloads", description: "Global research access" },
    { number: "156", label: "Countries", description: "Worldwide research collaboration" },
    { number: "94%", label: "Evidence-Based", description: "Scientifically validated approaches" }
  ];

  const categories = [
    { id: 'all', label: 'All Research', count: researchPapers.length },
    { id: 'crisis-intervention', label: 'Crisis Intervention', count: researchPapers.filter(p => p.category === 'crisis-intervention').length },
    { id: 'digital-health', label: 'Digital Health', count: researchPapers.filter(p => p.category === 'digital-health').length },
    { id: 'peer-support', label: 'Peer Support', count: researchPapers.filter(p => p.category === 'peer-support').length },
    { id: 'cultural-competency', label: 'Cultural Competency', count: researchPapers.filter(p => p.category === 'cultural-competency').length },
    { id: 'technology', label: 'Technology', count: researchPapers.filter(p => p.category === 'technology').length },
    { id: 'economics', label: 'Economics', count: researchPapers.filter(p => p.category === 'economics').length }
  ];

  // Filtering logic
  const filteredReports = researchPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Slide effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const featured = researchPapers
      .filter(paper => paper.impact === 'high')
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 3);
    setFeaturedReports(featured);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Impact color classes (applies CSS classes only)
  const getImpactClass = (impact) => {
    switch (impact) {
      case 'high': return 'impact-badge impact-high';
      case 'medium': return 'impact-badge impact-medium';
      case 'low': return 'impact-badge impact-low';
      default: return 'impact-badge';
    }
  };

  // Download action
  const handleDownload = (paper) => {
    alert(`Download initiated for: ${paper.title}`);
    // Implementation: handle actual download in production
  };

  return (
    <div className="reports-page">
      {/* HERO SLIDER */}
      <div className="relative h-screen overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            >
              <div className={`h-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center relative`}>
                <div className="hero-gradient-overlay"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                  <div className="mb-8" style={{ animation: 'slideInDown 0.8s ease-out 0.2s forwards' }}>
                    {slide.icon}
                  </div>
                  <h1 className="text-6xl font-bold mb-4 font-serif" style={{ animation: 'slideInUp 0.8s ease-out 0.4s forwards' }}>
                    {slide.title}
                  </h1>
                  <h2 className="text-2xl font-light mb-6" style={{ animation: 'slideInUp 0.8s ease-out 0.6s forwards' }}>
                    {slide.subtitle}
                  </h2>
                  <p className="text-xl leading-relaxed mb-8" style={{ animation: 'slideInUp 0.8s ease-out 0.8s forwards' }}>
                    {slide.content}
                  </p>
                  <div className="flex justify-center gap-4" style={{ animation: 'slideInUp 0.8s ease-out 1s forwards' }}>
                    <button className="btn-primary">Browse Research</button>
                    <button className="btn-secondary">Submit Research</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-secondary absolute left-8 top-1/2 transform -translate-y-1/2" onClick={prevSlide}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="btn-secondary absolute right-8 top-1/2 transform -translate-y-1/2" onClick={nextSlide}>
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* IMPACT STATS */}
      <section className="py-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif">Research Impact</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our commitment to evidence-based practices drives measurable change in mental health outcomes worldwide
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, idx) => (
              <div key={idx} className="stat-card text-center p-6 rounded-2xl">
                <div className="stat-number">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-white/70">{stat.description}</div>
                <div className="w-8 h-1 bg-blue-400 mx-auto mt-3 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED RESEARCH */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 font-serif">Featured Research</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Groundbreaking studies that are shaping the future of mental health intervention and suicide prevention
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredReports.map(paper => (
              <div key={paper.id} className="featured-card research-card">
                <div className="flex items-center justify-between mb-4">
                  <span className={getImpactClass(paper.impact)}>
                    {paper.impact.toUpperCase()} IMPACT
                  </span>
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{paper.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{paper.abstract}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{paper.year}</span>
                  <span className="flex items-center gap-1"><Download className="w-4 h-4" />{paper.downloads.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mb-6">
                  {paper.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="research-tag">{tag}</span>
                  ))}
                </div>
                <button className="download-btn w-full py-3" onClick={() => handleDownload(paper)}>
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH LIBRARY */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 font-serif">Research Library</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive collection of peer-reviewed research, studies, and reports on mental health and suicide prevention
            </p>
          </div>
          {/* Search + Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="search-input flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search research papers, authors, or topics..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="filter-select relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-8 py-4 rounded-2xl text-lg bg-white min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-tab${selectedCategory === category.id ? ' active' : ''}`}
                >
                  {category.label}
                  <span className="ml-2 text-sm opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
          {/* Papers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReports.map((paper, index) => (
              <div
                key={paper.id}
                className="research-card opacity-0"
                style={{ animation: `fadeInUp 0.6s ease-out forwards`, animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-500">{paper.year}</span>
                  </div>
                  <span className={getImpactClass(paper.impact)}>{paper.impact}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 line-clamp-2">{paper.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{paper.authors}</p>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{paper.abstract}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {paper.tags.slice(0, 3).map((tag, idx) => (
                    <span className="research-tag" key={idx}>{tag}</span>
                  ))}
                  {paper.tags.length > 3 && (
                    <span className="research-tag text-gray-400 text-xs">
                      +{paper.tags.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {paper.downloads.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {paper.citations}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="download-btn flex-1 py-2" onClick={() => handleDownload(paper)}>
                    <Download className="w-4 h-4" />Download
                  </button>
                  <button className="btn-secondary px-3 py-2"><Eye className="w-4 h-4 text-gray-600" /></button>
                  <button className="btn-secondary px-3 py-2"><Share className="w-4 h-4 text-gray-600" /></button>
                </div>
              </div>
            ))}
          </div>
          {filteredReports.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No Research Found</h3>
              <p className="text-gray-400">Try adjusting your search terms or category filters</p>
            </div>
          )}
          {filteredReports.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-primary">Load More Research</button>
            </div>
          )}
        </div>
      </section>

      {/* RESEARCH COMMUNITY */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif">Join Our Research Community</h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Contribute to the global effort in mental health research. Share your findings, collaborate with experts,
            and help shape evidence-based practices that save lives.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <h3 className="text-xl font-semibold mb-3">Submit Research</h3>
              <p className="text-white/80 text-sm">
                Share your studies and findings with our global research community
              </p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h3 className="text-xl font-semibold mb-3">Collaborate</h3>
              <p className="text-white/80 text-sm">
                Connect with researchers worldwide for joint studies and projects
              </p>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <h3 className="text-xl font-semibold mb-3">Impact Lives</h3>
              <p className="text-white/80 text-sm">
                Help translate research into real-world interventions and policies
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">Submit Your Research</button>
            <button className="btn-secondary">Join Research Network</button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 font-serif">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest research findings and mental health insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Unsubscribe at any time. We respect your privacy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Reports;
