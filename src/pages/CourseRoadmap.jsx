import React, { useEffect } from 'react';
import './CourseRoadmap.css';

export default function CourseRoadmap() {
  useEffect(() => {
    // Animate progress bar
    setTimeout(() => {
      const progressBar = document.getElementById('progressBar');
      if (progressBar) {
        progressBar.style.width = '33%';
      }
    }, 500);

    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Card interaction effects
    const cards = document.querySelectorAll('.stage-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.action-button:not(.disabled)');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-effect 0.6s ease-out;
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-effect {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Parallax effect on scroll
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const shapes = document.querySelectorAll('.floating-shape');
          shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.05;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Countdown timer
    function updateCountdown() {
      const deadline = new Date('December 8, 2025 23:59:59').getTime();
      const now = new Date().getTime();
      const distance = deadline - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      
      if (days > 0 && days <= 10) {
        const deadlineAlert = document.querySelector('.deadline-alert');
        if (deadlineAlert) {
          deadlineAlert.style.animation = 'pulse-alert 2s infinite';
        }
      }
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 3600000);

    // Keyboard navigation
    const handleKeydown = (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('action-button') && !e.target.disabled) {
        e.target.click();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeydown);
      clearInterval(countdownInterval);
      observer.disconnect();
    };
  }, []);

  const copyToClipboard = (elementId) => {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      const btn = element.nextElementSibling;
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = 'rgba(17, 153, 142, 0.2)';
      btn.style.color = '#11998e';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    });
  };

  const openCourse = () => {
    window.open('https://academy.hubspot.com/courses/content-marketing', '_blank');
  };

  return (
    <>
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Left Sidebar */}
      <div className="sidebar-left">
        <div className="sidebar-decoration">
          <div className="decoration-card">
            <span className="decoration-icon">💡</span>
            <h3 className="decoration-title">Learn & Grow</h3>
            <p className="decoration-text">Transform your career with industry-leading knowledge and practical skills</p>
          </div>

          <div className="decoration-card">
            <span className="decoration-icon">🌟</span>
            <h3 className="decoration-title">Build Expertise</h3>
            <p className="decoration-text">Master cutting-edge strategies used by top professionals worldwide</p>
          </div>

          <div className="decoration-card">
            <span className="decoration-icon">🚀</span>
            <h3 className="decoration-title">Advance Further</h3>
            <p className="decoration-text">Unlock new opportunities with recognized certifications</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="sidebar-right">
        <div className="info-card">
          <h3>✨ Why Learn With Us</h3>
          <div className="benefit-item">
            <span className="benefit-icon">🎯</span>
            <div className="benefit-text">
              <h4>Structured Learning</h4>
              <p>Follow a clear, progressive path designed for success</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🏆</span>
            <div className="benefit-text">
              <h4>Industry Recognition</h4>
              <p>Earn credentials valued by employers globally</p>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>📚 Learning Resources</h3>
          <div className="benefit-item">
            <span className="benefit-icon">🎬</span>
            <div className="benefit-text">
              <h4>Video Tutorials</h4>
              <p>Engaging visual content for better understanding</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📝</span>
            <div className="benefit-text">
              <h4>Practice Exercises</h4>
              <p>Knowledge with Hands-on activities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="container-roadmap">
          {/* Header with Background Container */}
          <div className="header-container">
            <div className="header-bg-pattern"></div>
            <header className="header-roadmap">
              <div className="header-badge">🎓 Professional Certification Program</div>
              <h1>Content Analyst Course</h1>
              <p>Master content marketing and analytics through our comprehensive three-stage program</p>
            </header>
          </div>

          {/* Progress Overview */}
          <section className="progress-overview loading">
            <div className="progress-header">
              <h2>Your Learning Journey</h2>
              <div className="progress-stats">
                <div className="stat-item">
                  <span className="stat-value">33%</span>
                  <span className="stat-label">Progress</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">1/3</span>
                  <span className="stat-label">Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">8hrs</span>
                  <span className="stat-label">Duration</span>
                </div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" id="progressBar"></div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="roadmap">
            <div className="roadmap-line"></div>

            {/* Stage 1: Active */}
            <div className="stage-container">
              <div className="stage-number-badge">1</div>
              <div className="stage-card active">
                <div className="stage-header">
                  <div className="stage-title-group">
                    <h3 className="stage-title"><span>Foundation Stage</span></h3>
                    <p className="stage-subtitle">Content Marketing Fundamentals & Certification</p>
                  </div>
                  <div className="stage-status status-active">
                    <span className="status-icon"></span>
                    <span>Active</span>
                  </div>
                </div>

                <div className="provider-badge">
                  <span className="provider-logo">🏛️</span>
                  <span>HubSpot Academy</span>
                </div>

                <div className="alerts-container">
                  <div className="deadline-alert">
                    <div className="alert-icon">⏰</div>
                    <div className="alert-content">
                      <h4>Completion Deadline</h4>
                      <p><span className="alert-date">December 8, 2025</span></p>
                    </div>
                  </div>
                  <div className="exam-alert">
                    <div className="alert-icon">📝</div>
                    <div className="alert-content">
                      <h4>Course Exam</h4>
                      <p><span className="alert-date">December 10, 2025</span></p>
                    </div>
                  </div>
                </div>

                <div className="credentials-section">
                  <h4>🔐 Access Credentials</h4>
                  <div className="credential-item">
                    <div className="credential-label">Email Address</div>
                    <div className="credential-box">
                      <span id="email">manpowercourse@gmail.com</span>
                      <button className="copy-btn" onClick={() => copyToClipboard('email')}>Copy</button>
                    </div>
                  </div>
                  <div className="credential-item">
                    <div className="credential-label">Password</div>
                    <div className="credential-box">
                      <span id="password">CNTANL-p@2025</span>
                      <button className="copy-btn" onClick={() => copyToClipboard('password')}>Copy</button>
                    </div>
                  </div>
                </div>

                <p className="course-description">
                  Build a strong foundation in content marketing through HubSpot's certification program. 
                  Learn strategic content creation, SEO optimization, distribution strategies, and performance analytics used by Fortune 500 companies.
                </p>

                <div className="details-grid">
                  <div className="detail-card">
                    <span className="detail-icon">⏱️</span>
                    <div className="detail-value">8 Hrs</div>
                    <div className="detail-label">Duration</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">🎯</span>
                    <div className="detail-value">1</div>
                    <div className="detail-label">Cycle</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">📚</span>
                    <div className="detail-value">14</div>
                    <div className="detail-label">Lessons</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">🎬</span>
                    <div className="detail-value">54</div>
                    <div className="detail-label">Videos</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">✅</span>
                    <div className="detail-value">11</div>
                    <div className="detail-label">Quizzes</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">🏆</span>
                    <div className="detail-value">Yes</div>
                    <div className="detail-label">Certificate</div>
                  </div>
                </div>

                <div className="topics-section">
                  <h4>📖 Core Learning Modules</h4>
                  <div className="topics-grid">
                    <div className="topic-tag">SEO Optimization</div>
                    <div className="topic-tag">Content Strategy</div>
                    <div className="topic-tag">Storytelling</div>
                    <div className="topic-tag">Content Creation</div>
                    <div className="topic-tag">Distribution</div>
                    <div className="topic-tag">Analytics & ROI</div>
                    <div className="topic-tag">Repurposing</div>
                    <div className="topic-tag">Research</div>
                  </div>
                </div>

                <button className="action-button" onClick={openCourse}>
                  🚀 Begin Learning
                </button>
              </div>
            </div>

            {/* Stage 2: Upcoming */}
            <div className="stage-container">
              <div className="stage-number-badge">2</div>
              <div className="stage-card upcoming">
                <div className="stage-header">
                  <div className="stage-title-group">
                    <h3 className="stage-title"><span>Advanced Stage</span></h3>
                    <p className="stage-subtitle">Strategic Content Analysis & Optimization</p>
                  </div>
                  <div className="stage-status status-upcoming">
                    <span className="status-icon"></span>
                    <span>Soon</span>
                  </div>
                </div>

                <div className="upcoming-overlay">
                  <div className="upcoming-icon">🔒</div>
                  <h3 className="upcoming-title">Unlocks After Stage 1</h3>
                  <p className="course-description">
                    Advance your expertise with data-driven analysis, competitive research, and optimization techniques for enterprise-level content operations.
                  </p>
                </div>

                <div className="details-grid">
                  <div className="detail-card">
                    <span className="detail-icon">🎯</span>
                    <div className="detail-value">2</div>
                    <div className="detail-label">Cycle</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">📊</span>
                    <div className="detail-value">TBA</div>
                    <div className="detail-label">Duration</div>
                  </div>
                </div>

                <p className="unlock-message">✨ Complete Stage 1 to unlock</p>

                <button className="action-button disabled" disabled>
                  🔒 Locked
                </button>
              </div>
            </div>

            {/* Stage 3: Upcoming */}
            <div className="stage-container">
              <div className="stage-number-badge">3</div>
              <div className="stage-card upcoming">
                <div className="stage-header">
                  <div className="stage-title-group">
                    <h3 className="stage-title"><span>Mastery Stage</span></h3>
                    <p className="stage-subtitle">Expert-Level Content Leadership</p>
                  </div>
                  <div className="stage-status status-upcoming">
                    <span className="status-icon"></span>
                    <span>Soon</span>
                  </div>
                </div>

                <div className="upcoming-overlay">
                  <div className="upcoming-icon">🔒</div>
                  <h3 className="upcoming-title">Unlocks After Stage 2</h3>
                  <p className="course-description">
                    Achieve mastery as a certified content analyst. Lead strategic initiatives, conduct audits, and develop frameworks that drive business transformation.
                  </p>
                </div>

                <div className="details-grid">
                  <div className="detail-card">
                    <span className="detail-icon">🎯</span>
                    <div className="detail-value">3</div>
                    <div className="detail-label">Cycle</div>
                  </div>
                  <div className="detail-card">
                    <span className="detail-icon">🎓</span>
                    <div className="detail-value">Yes</div>
                    <div className="detail-label">Pro Cert</div>
                  </div>
                </div>

                <p className="unlock-message">✨ Complete Stages 1 & 2 to unlock</p>

                <button className="action-button disabled" disabled>
                  🔒 Locked
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
