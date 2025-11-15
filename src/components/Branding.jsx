import React from 'react';

export default function Branding() {
  return (
    <div className="brand">
      <div className="brand-logo" aria-label="ManPower E-Learning Academy">
        <span className="logo-icon">MP</span>
      </div>
      <div className="brand-content">
        <h1 className="brand-title">
          ManPower{' '}
          <span className="brand-highlight">E-Learning</span>{' '}
          <span className="brand-text">Academy</span>
        </h1>
        <div className="brand-subtitle">
          Powered By <strong>Udemy</strong>
        </div>
        <div className="badges">
          <span className="badge pro">
            <span className="badge-icon">⭐</span>
            PRO
          </span>
          <span className="badge premium">
            <span className="badge-icon">💎</span>
            PREMIUM
          </span>
        </div>
      </div>
    </div>
  );
}
