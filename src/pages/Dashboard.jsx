// src/pages/Dashboard.jsx
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

  // COURSES TAB
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
                e x1="21" y1="12" x2="9" y2="12"></line>
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

  // EXAMS TAB – simple “coming soon”
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
                e x1="21" y1="12" x2="9" y2="12"></line>
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
            <p>We’re preparing comprehensive assessments to test your knowledge.</p>
            <p className="coming-soon-subtext">Stay tuned for updates.</p>
            <button className="btn-primary" onClick={() => setActiveTab('dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // DASHBOARD TAB – NEW ULTRA-PRO LAYOUT
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
              e x1="21" y1="12" x2="9" y2="12"></line>
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

      <div className="container onboard-layout" aria-live="polite">
        {/* SUMMARY STRIP */}
        <section className="onboard-header" aria-labelledby="onboard-title">
          <div className="onboard-header-main">
            <div className="onboard-chip">
              <span className="onboard-chip-dot" />
              Onboarding overview
            </div>
            <h2 id="onboard-title" className="onboard-title">
              Final step before your platform goes live
            </h2>
            <p className="onboard-subtitle">
              Documents and background checks are complete. Submit the bond / service
              agreement to activate your ManPower E-Learning Platform.
            </p>
          </div>

          <div className="onboard-header-meta" aria-label="Onboarding metrics">
            <div className="onboard-metric">
              <span className="onboard-metric-label">Checks completed</span>
              <span className="onboard-metric-value">2 / 3</span>
              <span className="onboard-metric-meta">Verification & documents</span>
            </div>
            <div className="onboard-metric bordered">
              <span className="onboard-metric-label">Pending item</span>
              <span className="onboard-metric-value highlight">Bond agreement</span>
              <span className="onboard-metric-meta">Deadline · 8 June, 11:59 PM</span>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN GRID: TIMELINE + BOND PANEL */}
        <section className="onboard-grid" aria-label="Onboarding checklist">
          {/* LEFT: vertical stepper */}
          <div className="onboard-timeline">
            <div className="onboard-timeline-line" aria-hidden="true" />
            <article className="onboard-step onboard-step-complete">
              <div className="onboard-step-bullet">
                <span className="onboard-step-icon">✓</span>
              </div>
              <div className="onboard-step-body">
                <div className="onboard-step-header">
                  <h3>Documents Verification</h3>
                  <span className="onboard-step-status success">Completed</span>
                </div>
                <p>
                  All required documents have been reviewed and verified. You are fully
                  cleared for this step.
                </p>
              </div>
            </article>

            <article className="onboard-step onboard-step-complete">
              <div className="onboard-step-bullet">
                <span className="onboard-step-icon">✓</span>
              </div>
              <div className="onboard-step-body">
                <div className="onboard-step-header">
                  <h3>Background Verification</h3>
                  <span className="onboard-step-status success">Completed</span>
                </div>
                <p>
                  Background verification has been successfully completed and approved by
                  the onboarding team.
                </p>
              </div>
            </article>

            <article className="onboard-step onboard-step-pending">
              <div className="onboard-step-bullet">
                <span className="onboard-step-icon pending">!</span>
              </div>
              <div className="onboard-step-body">
                <div className="onboard-step-header">
                  <h3>Bond Agreement Submission</h3>
                  <span className="onboard-step-status pending">Pending</span>
                </div>
                <p>
                  Please review, sign and submit the bond / service agreement before the
                  deadline to avoid activation delays.
                </p>
              </div>
            </article>
          </div>

          {/* RIGHT: bond detail panel */}
          <aside className="onboard-bond-card" aria-label="Bond agreement details">
            <div className="onboard-bond-header">
              <span className="onboard-bond-label">Step 3 · Action required</span>
              <div className="onboard-bond-pulse" aria-hidden="true" />
            </div>
            <h3 className="onboard-bond-title">Submit your bond agreement</h3>
            <p className="onboard-bond-text">
              Download the service agreement shared with you, sign it as per the
              instructions, and submit it through the official channel or portal
              communicated by the onboarding team.
            </p>

            <ul className="onboard-bond-list">
              >Ensure all pages are signed wherever required.</li>
              >Use your registered full name and contact details.</li>
              >
                Keep a digital copy for your records once submission is complete.
              </li>
            </ul>

            <div className="onboard-bond-footer">
              <div className="onboard-deadline-pill">
                <span className="onboard-deadline-dot" />
                <span className="onboard-deadline-text">
                  Deadline: <strong>8 June, 11:59 PM</strong>
                </span>
              </div>
              <p className="onboard-bond-note">
                After successful verification of the agreement, your E-Learning Platform
                will be activated with full training access.
              </p>
            </div>
          </aside>
        </section>

        {/* BOTTOM INFO STRIP */}
        <section
          className="onboard-footer-strip"
          aria-labelledby="activation-notice-title"
        >
          <div className="onboard-footer-card">
            <div className="onboard-footer-icon">☑️</div>
            <div className="onboard-footer-content">
              <h3 id="activation-notice-title">Platform activation notice</h3>
              <p>
                Once you submit the <strong>Service Agreement</strong>, your ManPower
                E-Learning Platform will be activated with your training modules,
                assessments and learning resources.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
