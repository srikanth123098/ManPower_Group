import React, { useState } from 'react';
import Branding from '../components/Branding';
import CourseRoadmap from './CourseRoadmap';

function safeGetUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return { name: 'Akula Chandra Sekhar', email: 'MPGCAT@0078' };
    if (raw.trim() === '') return { name: 'Akula Chandra Sekhar', email: 'MPGCAT@0078' };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { name: 'Akula Chandra Sekhar', email: 'MPGCAT@0078' };
    }
    return {
      name: parsed.name || 'Akula Chandra Sekhar',
      email: parsed.email || 'MPGCAT@0078'
    };
  } catch (err) {
    console.warn('safeGetUser parse error', err);
    return { name: 'Akula Chandra Sekhar', email: 'MPGCAT@0078' };
  }
}

export default function Dashboard({ setAuthed }) {
  const user = safeGetUser();
  const [activeTab, setActiveTab] = useState('dashboard');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof setAuthed === 'function') setAuthed(false);
    window.location.hash = '#/';
  }

  // RENDER COURSES TAB
  if (activeTab === 'courses') {
    return (
      <>
        <header className="header" role="banner">
          <div className="header-container">
            <Branding />
            <div className="welcome">
              <div className="kicker">Welcome Back</div>
              <div className="username">{user.name}</div>
            </div>
            <button className="logout" onClick={handleLogout} aria-label="Logout">
              <span>Logout</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </header>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Courses
          </button>
          <button
            className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            📝 Exams
          </button>
        </div>

        <CourseRoadmap />
      </>
    );
  }

  // RENDER EXAMS TAB
  if (activeTab === 'exams') {
    return (
      <>
        <header className="header" role="banner">
          <div className="header-container">
            <Branding />
            <div className="welcome">
              <div className="kicker">Welcome Back</div>
              <div className="username">{user.name}</div>
            </div>
            <button className="logout" onClick={handleLogout} aria-label="Logout">
              <span>Logout</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </header>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            📚 Courses
          </button>
          <button
            className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            📝 Exams
          </button>
        </div>

        <div className="coming-soon-page">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">🚀</div>
            <h1>Exams Coming Soon!</h1>
            <p>We're preparing comprehensive assessments to test your knowledge.</p>
            <p className="coming-soon-subtext">Stay tuned for updates!</p>
            <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // DEFAULT: RENDER DASHBOARD TAB
  return (
    <>
      <div className="orb orb-1" aria-hidden="true"></div>
      <div className="orb orb-2" aria-hidden="true"></div>
      <div className="orb orb-3" aria-hidden="true"></div>

      <header className="header" role="banner">
        <div className="header-container">
          <Branding />
          <div className="welcome">
            <div className="kicker">Welcome Back</div>
            <div className="username">{user.name}</div>
          </div>
          <button className="logout" onClick={handleLogout} aria-label="Logout">
            <span>Logout</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 Courses
        </button>
        <button
          className={`tab-btn ${activeTab === 'exams' ? 'active' : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          📝 Exams
        </button>
      </div>

      <div className="container" aria-live="polite">
        <section className="activation-hero" aria-labelledby="activation-title">
          <div className="activation-hero-content">
            <span className="activation-badge">ONBOARDING STATUS</span>
            <h2 id="activation-title" className="activation-title">
              Your onboarding is almost complete
            </h2>
            <p className="activation-description">
              Please review your current verification status below. Your E-Learning Platform
              will be activated once the service agreement is successfully submitted.
            </p>
          </div>

          <div className="activation-progress-card">
            <div className="activation-progress-top">
              <span>Completion Status</span>
              <strong>2 of 3 completed</strong>
            </div>
            <div className="activation-progress-bar">
              <div className="activation-progress-fill"></div>
            </div>
            <p className="activation-progress-note">
              Submit the pending agreement before the deadline to unlock training access.
            </p>
          </div>
        </section>

        <section className="verification-grid" aria-label="Verification checklist">
          <article className="verification-card verification-card-success">
            <div className="verification-card-top">
              <div className="verification-icon">✓</div>
              <span className="verification-status verification-status-success">Completed</span>
            </div>
            <h3>Documents Verification</h3>
            <p>
              Your document verification process has been completed successfully. No further
              action is required for this step.
            </p>
          </article>

          <article className="verification-card verification-card-success">
            <div className="verification-card-top">
              <div className="verification-icon">✓</div>
              <span className="verification-status verification-status-success">Completed</span>
            </div>
            <h3>Background Verification</h3>
            <p>
              Your background verification has been completed successfully and approved by
              the onboarding team.
            </p>
          </article>

          <article className="verification-card verification-card-pending">
            <div className="verification-card-top">
              <div className="verification-icon">!</div>
              <span className="verification-status verification-status-pending">Pending</span>
            </div>
            <h3>Bond Agreement Submission</h3>
            <p>
              Bond agreement submission is still pending. Please complete and submit it before
              the final deadline to proceed with platform activation.
            </p>
            <div className="verification-deadline">
              Deadline: <strong>8 June, 11:59 PM</strong>
            </div>
          </article>
        </section>

        <section className="activation-message-section" aria-labelledby="activation-message-title">
          <div className="activation-message-card">
            <div className="activation-message-icon">📘</div>
            <div className="activation-message-content">
              <h3 id="activation-message-title">Platform Activation Notice</h3>
              <p>
                Once you submit the <strong>Service Agreement</strong>, your E-Learning Platform
                will be activated with your training modules and learning access.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
