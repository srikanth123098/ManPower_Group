import React, { useEffect, useState } from 'react';
import API from '../api';
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

  const displayStatus = voucherRecord
    ? computeStatusFromRecord({ submittedAt: voucherRecord.submittedAt })
    : null;

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
        <section className="dashboard-hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-badge">🎓 Learning Dashboard</div>
            <h2 id="hero-title" className="hero-title">
              Welcome to Your Learning Journey
            </h2>
            <p className="hero-description">
              Access all your course materials, track your progress, and unlock
              premium content with voucher codes. Complete prerequisites before
              the program starts.
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{docs.length}</div>
              <div className="hero-stat-label">Documents</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{voucherRecord ? '1' : '0'}</div>
              <div className="hero-stat-label">Active Course</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">
                {displayStatus === 'Verified' ? '100%' : '50%'}
              </div>
              <div className="hero-stat-label">Progress</div>
            </div>
          </div>
        </section>

        <section aria-labelledby="docs-title">
          <h3 className="section-title" id="docs-title">
            <span className="section-title-icon">📚</span>
            Course Documents
          </h3>

          <div className="docs-grid" aria-live="polite">
            {loadingDocs ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading your documents...</p>
              </div>
            ) : docs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h4>No Documents Yet</h4>
                <p>Course documents will appear here once uploaded by your instructor.</p>
              </div>
            ) : (
              docs.map((d, index) => (
                <article key={d._id || d.filename} className="doc-card" style={{ '--index': index }}>
                  <div className="doc-header">
                    <div className="doc-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                    </div>
                    <div className="doc-info">
                      <h4 className="doc-title">{d.title || d.originalname || 'Untitled Document'}</h4>
                      <div className="doc-meta">
                        <span className="doc-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {d.uploadDate ? new Date(d.uploadDate).toLocaleDateString() : 'No date'}
                        </span>
                        <span className="doc-meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                          </svg>
                          PDF
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    className="download-btn"
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/docs/file/${encodeURIComponent(d.filename || '')}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Download ${d.title || 'document'}`}
                  >
                    <span>Download</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </a>
                </article>
              ))
            )}
          </div>
        </section>

        <article className="udemy-card" aria-labelledby="udemy-title">
          <div className="udemy-badge">🎓 FREE COURSE</div>
          <div className="udemy-content">
            <div className="udemy-left">
              <h3 id="udemy-title">Free Udemy Course</h3>
              <p>Complete this foundational course before your main program begins. It covers essential prerequisites.</p>
              <div className="udemy-desc">
                <ul className="udemy-features">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                    <span>Self-paced learning</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                    <span>Certificate of completion</span>
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                    <span>Lifetime access</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="udemy-cta">
              <a href="https://www.udemy.com/share/101VDQ3@BjYjqoLwuaIInBLcES-IgmOfSliob5LXXuE3oZ1SaL6BrbToDQYpI9ibVJlF9_tN7g==/" target="_blank" rel="noreferrer">
                <button className="btn-primary">
                  <span>Open Course</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
              </a>
              <a href="https://www.udemy.com/" target="_blank" rel="noreferrer">
                <button className="btn-secondary">Enroll Free</button>
              </a>
            </div>
          </div>
        </article>

        <section className="voucher-section" aria-labelledby="voucher-title">
          <h3 className="section-title" id="voucher-title">
            <span className="section-title-icon">🎫</span>
            Redeem Voucher Code
          </h3>

          <form className="voucher-form" onSubmit={submitVoucher} aria-label="Voucher submission form">
            <div className="form-group">
              <label htmlFor="voucher-input" className="form-label">Voucher Code</label>
              <div className="input-group">
                <input
                  id="voucher-input"
                  className="input"
                  placeholder="Enter your voucher code"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  aria-label="Voucher code input"
                  disabled={loadingSubmit}
                />
                <button type="submit" className="btn-primary" aria-label="Submit voucher" disabled={loadingSubmit}>
                  {loadingSubmit ? (
                    <>
                      <span className="loader-sm"></span>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {voucherError && (
              <div className="alert alert-error" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                <div>
                  <strong>Error</strong>
                  <p>{voucherError}</p>
                </div>
              </div>
            )}
          </form>

          {voucherRecord ? (
            <div className="voucher-success">
              <article className="course-card" role="region" aria-label="Course details">
                <div className="course-hero">
                  <span className="course-badge">✨ PRO TRACK</span>
                  <h3 className="course-title">Content Analyst Program</h3>
                  <p className="course-sub">
                    Comprehensive 3-month technical and content analysis program
                    with industry experts and hands-on projects
                  </p>
                </div>

                <div className="course-body">
                  <div className="course-left">
                    <div className="course-stats">
                      <div className="stat">
                        <div className="stat-icon">⏱️</div>
                        <div>
                          <div className="stat-label">Duration</div>
                          <div className="stat-value">3 Months</div>
                        </div>
                      </div>
                      <div className="stat">
                        <div className="stat-icon">💰</div>
                        <div>
                          <div className="stat-label">Voucher Worth</div>
                          <div className="stat-value">₹60,000</div>
                        </div>
                      </div>
                      <div className="stat">
                        <div className="stat-icon">
                          {displayStatus === 'Verified' ? '✓' : displayStatus === 'Pending' ? '⏳' : '📝'}
                        </div>
                        <div>
                          <div className="stat-label">Status</div>
                          <div className="stat-value" style={{ color: displayStatus === 'Verified' ? '#10b981' : displayStatus === 'Pending' ? '#f59e0b' : '#6366f1' }}>
                            {displayStatus}
                          </div>
                        </div>
                      </div>
                      <div className="stat">
                        <div className="stat-icon">📅</div>
                        <div>
                          <div className="stat-label">Submitted</div>
                          <div className="stat-value" style={{ fontSize: '0.75rem' }}>
                            {voucherRecord.submittedAt ? new Date(voucherRecord.submittedAt).toLocaleDateString() : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="course-right">
                    <div className="verification-panel">
                      <div className="verification-header">
                        <h4>Verification Status</h4>
                        <span className={`status-badge status-${displayStatus?.toLowerCase()}`}>{displayStatus}</span>
                      </div>
                      <Tracker status={displayStatus || 'Submitted'} />
                      <div className="verification-info">
                        <div className="info-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{voucherRecord.submittedAt ? new Date(voucherRecord.submittedAt).toLocaleString() : '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <div className="alert alert-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                <div>
                  <strong>Voucher Submitted Successfully!</strong>
                  <p>Your submission has been received and is under verification. You'll receive final confirmation once the process is complete.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🎫</div>
              <h4>No Voucher Submitted</h4>
              <p>Enter a valid voucher code above to unlock your premium course content and start your learning journey.</p>
            </div>
          )}
        </section>

        <div className="alert alert-warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
          </svg>
          <div>
            <strong>Important Deadline</strong>
            <p>Please complete all documents and the free Udemy course by <strong>20th November 2025</strong>. Your main program begins from this date.</p>
          </div>
        </div>
      </div>
    </>
  );
}
