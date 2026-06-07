// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import Branding from '../components/Branding';
import CourseRoadmap from './CourseRoadmap';
import ExamPlatform from './ExamPlatform';

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
      console.log('Fetched docs:', res.data);
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

        <ExamPlatform />
      </>
    );
  }

  // DEFAULT: DASHBOARD TAB WITH NEW CONTENT
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

      <div className="container" aria-live="polite">
        {/* ENTERPRISE-STYLE ONBOARDING STATUS HERO */}
        <section className="status-hero" aria-labelledby="onboarding-title">
          <div className="status-hero-left">
            <span className="status-eyebrow">Onboarding Status</span>
            <h2 id="onboarding-title" className="status-hero-title">
              You are one step away from activation
            </h2>
            <p className="status-hero-text">
              Core checks for your ManPower E-Learning Academy profile are almost complete.
              Review the items below and submit your bond agreement before the deadline to
              activate your E-Learning platform.
            </p>

            <div className="status-hero-meta">
              <div className="status-chip status-chip-success">
                <span className="status-chip-dot"></span>
                Documents verification completed
              </div>
              <div className="status-chip status-chip-success">
                <span className="status-chip-dot"></span>
                Background verification completed
              </div>
              <div className="status-chip status-chip-pending">
                <span className="status-chip-dot"></span>
                Bond agreement submission pending · Deadline 8 June, 11:59 PM
              </div>
            </div>
          </div>

          <div className="status-hero-right" aria-label="Activation progress overview">
            <div className="status-summary-card">
              <div className="status-summary-header">
                <span className="status-summary-label">Activation progress</span>
                <span className="status-summary-count">2 / 3 checks completed</span>
              </div>
              <div className="status-progress-bar">
                <div className="status-progress-fill" style={{ width: '66%' }} />
              </div>
              <p className="status-summary-text">
                Complete and submit the signed bond / service agreement to move to{" "}
                <strong>full platform access</strong> with all training modules unlocked.
              </p>
              <div className="status-deadline">
                <span className="status-deadline-label">Time-sensitive</span>
                <span className="status-deadline-value">8 June, 11:59 PM</span>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILED STATUS CARDS */}
        <section
          className="status-grid-section"
          aria-label="Detailed onboarding checklist"
        >
          <div className="status-grid">
            <article className="status-card status-card-complete">
              <header className="status-card-header">
                <div className="status-card-icon status-card-icon-success">📁</div>
                <div>
                  <h3 className="status-card-title">Documents Verification</h3>
                  <span className="status-pill status-pill-complete">Completed</span>
                </div>
              </header>
              <p className="status-card-body">
                All mandatory documents submitted to ManPower E-Learning Academy have been
                reviewed and verified by the onboarding team. No further action is required
                for this step.
              </p>
            </article>

            <article className="status-card status-card-complete">
              <header className="status-card-header">
                <div className="status-card-icon status-card-icon-success">🔍</div>
                <div>
                  <h3 className="status-card-title">Background Verification</h3>
                  <span className="status-pill status-pill-complete">Completed</span>
                </div>
              </header>
              <p className="status-card-body">
                Your background verification has been successfully completed. You are
                eligible to proceed with the bond agreement and training program.
              </p>
            </article>

            <article className="status-card status-card-pending">
              <header className="status-card-header">
                <div className="status-card-icon status-card-icon-pending">📝</div>
                <div>
                  <h3 className="status-card-title">Bond / Service Agreement</h3>
                  <span className="status-pill status-pill-pending">Submission pending</span>
                </div>
              </header>
              <p className="status-card-body">
                Please review, sign and submit the bond / service agreement before the
                deadline to avoid delays in your program start date.
              </p>
              <ul className="status-card-listst">
                >Download and read the bond / service agreement carefully.</l/li>
                >Sign the agreement as per the instructions provided.</l/li>
                >
                  Submit the signed copy through the official communication channel or
                  portal shared with you.
                </li>
              </ul>
              <div className="status-card-deadline">
                <span className="status-card-deadline-label">Submission deadline</span>
                <span className="status-card-deadline-value">8 June · 11:59 PM</span>
              </div>
            </article>
          </div>
        </section>

        {/* NEXT STEPS / INFORMATION PANEL */}
        <section className="status-next-steps" aria-labelledby="next-steps-title">
          <div className="status-next-steps-card">
            <h3 id="next-steps-title">What happens after you submit?</h3>
            <p className="status-next-steps-text">
              Once you submit the <strong>service agreement</strong>, your E-Learning
              platform will be activated with your training modules and practice resources.
            </p>
            <div className="status-next-steps-grid">
              <div className="status-next-steps-column">
                <h4 className="status-next-steps-heading">Post-submission journey</h4>
                <ul className="status-next-steps-listst">
                  >Receive confirmation of agreement receipt on your registered email.</l/li>
                  >Training modules and learning paths are allocated to your account.</l/li>
                  >Access to course content, practice exams and live sessions is enabled.</li>
                </ul>
              </div>
              <div className="status-next-steps-column">
                <h4 className="status-next-steps-heading">Need support?</h4>
                <p className="status-support-text">
                  If you have already submitted the bond agreement or have any queries
                  regarding the document, please reach out to the onboarding support team
                  with your registered name and email ID.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
