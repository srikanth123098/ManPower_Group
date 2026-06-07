// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import Branding from '../components/Branding';
import CourseRoadmap from './CourseRoadmap';

function safeGetUser() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return { name: 'Daram Sai Jaswanth Reddy', email: 'MPGCAT@0078' };
    if (raw.trim() === '') return { name: 'Daram Sai Jaswanth Reddy', email: 'MPGCAT@0078' };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { name: 'Daram Sai Jaswanth Reddy', email: 'MPGCAT@0078' };
    }
    return {
      name: parsed.name || 'Daram Sai Jaswanth Reddy',
      email: parsed.email || 'MPGCAT@0078'
    };
  } catch (err) {
    console.warn('safeGetUser parse error', err);
    return { name: 'Daram Sai Jaswanth Reddy', email: 'MPGCAT@0078' };
  }
}

function computeStatusFromRecord(record) {
  if (!record || !record.submittedAt) return 'Not submitted';
  const submitted = new Date(record.submittedAt);
  const now = new Date();
  const diffMinutes = (now - submitted) / (1000 * 60);
  if (diffMinutes >= 2) return 'Verified';
  if (diffMinutes >= 1) return 'Pending';
  return 'Submitted';
}

function Tracker({ status }) {
  const steps = ['Submitted', 'Pending', 'Verified'];
  const currentIndex = Math.max(0, steps.indexOf(status));

  return (
    <div className="tracker-wrap">
      <div className="tracker-steps" role="list" aria-label="Voucher tracking steps">
        {steps.map((step, i) => {
          const stateClass =
            i < currentIndex
              ? 'step-complete'
              : i === currentIndex
              ? 'step-active'
              : 'step-inactive';
          return (
            <div
              key={step}
              className={`tracker-step ${stateClass}`}
              role="listitem"
              aria-current={i === currentIndex ? 'step' : undefined}
            >
              <div className="tracker-circle" aria-hidden="true">
                {i < currentIndex ? '✓' : i + 1}
              </div>
              <div className="tracker-label">{step}</div>
            </div>
          );
        })}
      </div>

      <div className="tracker-bar" aria-hidden="true">
        <div
          className="tracker-fill"
          style={{
            width:
              currentIndex === 0 ? '10%' : currentIndex === 1 ? '55%' : '100%'
          }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({ setAuthed }) {
  const user = safeGetUser();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [docs, setDocs] = useState([]);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherRecord, setVoucherRecord] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    fetchDocs();
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDocs() {
    setLoadingDocs(true);
    try {
      const res = await API.get('/api/docs');
      console.log('Fetched docs:', res.data); // Debug log
      setDocs(res.data?.docs || []);
    } catch (err) {
      console.error('fetchDocs error', err);
      setDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  }

  async function fetchStatus() {
    try {
      const res = await API.get(
        `/api/voucher/status/${encodeURIComponent(user.email)}`
      );
      if (
        res.data &&
        res.data.status &&
        res.data.status !== 'Not submitted'
      ) {
        setVoucherRecord(res.data);
      } else {
        setVoucherRecord(null);
      }
    } catch (err) {
      console.warn('fetchStatus error', err);
      setVoucherRecord(null);
    }
  }

  async function submitVoucher(e) {
    e.preventDefault();
    setVoucherError('');
    if (!voucherInput || !voucherInput.trim()) {
      setVoucherError('Please enter voucher code');
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await API.post('/api/voucher/submit', {
        email: user.email,
        code: voucherInput.trim()
      });
      const verified = res.data?.verified === true;

      if (!verified) {
        setVoucherRecord(null);
        setLoadingSubmit(false);
        return;
      }

      await fetchStatus();
      setVoucherInput('');
    } finally {
      setLoadingSubmit(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof setAuthed === 'function') setAuthed(false);
    window.location.hash = '#/';
  }

  function handleDownload(doc) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const possibleUrls = [
      `${apiUrl}/api/docs/file/${doc.filename}`,
      `${apiUrl}/uploads/${doc.filename}`,
      doc.url
    ].filter(Boolean);

    console.log('Attempting download with URLs:', possibleUrls);
    console.log('Document data:', doc);

    const downloadUrl = possibleUrls[0];

    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      alert('Document file is not available. Please contact support.');
    }
  }

  const displayStatus = voucherRecord
    ? computeStatusFromRecord({ submittedAt: voucherRecord.submittedAt })
    : null;

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

  // EXAMS TAB
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

  // DASHBOARD TAB – new layout + footer, logic unchanged
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

      <div className="container onboard-layout" aria-live="polite">
        {/* TOP SUMMARY HEADER */}
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

        {/* TIMELINE + BOND PANEL */}
        <section className="onboard-grid" aria-label="Onboarding checklist">
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
              <li>Ensure all pages are signed wherever required.</li>
              <li>Use your registered full name and contact details.</li>
              <li>Keep a digital copy for your records once submission is complete.</li>
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

      {/* GLOBAL FOOTER FOR DASHBOARD TAB */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <div className="site-footer-title">ManPower E-Learning Academy</div>
            <p>
              Structured learning journeys, verified onboarding, and industry-aligned
              training modules to accelerate your career.
            </p>
          </div>
          <div className="site-footer-columns">
            <div>
              <h4>Support</h4>
              <p>Email: support@manpower-elearning.com</p>
              <p>Hours: 9:00 AM – 6:00 PM (IST)</p>
            </div>
            <div>
              <h4>Platform</h4>
              <p>Secure onboarding, curated content, and proctored assessments.</p>
            </div>
            <div>
              <h4>Legal</h4>
              <p>Terms of Use · Privacy Policy</p>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© {new Date().getFullYear()} ManPower E-Learning Academy</span>
          <span>All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}



