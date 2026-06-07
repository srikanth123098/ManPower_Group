/* ================================
   DASHBOARD ACTIVATION SECTION
================================ */

.activation-hero {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2rem;
  align-items: stretch;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.activation-hero-content,
.activation-progress-card,
.verification-card,
.activation-message-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 24px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

.activation-hero-content {
  padding: 2rem;
}

.activation-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.12);
  color: #4f46e5;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.activation-title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  line-height: 1.15;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.activation-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-medium);
  max-width: 60ch;
}

.activation-progress-card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.activation-progress-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: var(--text-medium);
}

.activation-progress-top strong {
  color: var(--text-dark);
  font-size: 1rem;
}

.activation-progress-bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.22);
  overflow: hidden;
  margin-bottom: 1rem;
}

.activation-progress-fill {
  width: 66.66%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #10b981, #34d399);
}

.activation-progress-note {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-medium);
}

.verification-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.verification-card {
  padding: 1.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.verification-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.12);
}

.verification-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.verification-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
}

.verification-card-success .verification-icon {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}

.verification-card-pending .verification-icon {
  background: rgba(245, 158, 11, 0.14);
  color: #d97706;
}

.verification-status {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.verification-status-success {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.verification-status-pending {
  background: rgba(245, 158, 11, 0.16);
  color: #b45309;
}

.verification-card h3 {
  font-size: 1.1rem;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

.verification-card p {
  font-size: 0.96rem;
  line-height: 1.65;
  color: var(--text-medium);
}

.verification-deadline {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
  font-size: 0.92rem;
  font-weight: 600;
}

.activation-message-section {
  margin-bottom: 2rem;
}

.activation-message-card {
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.activation-message-icon {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.12);
  font-size: 1.5rem;
}

.activation-message-content h3 {
  font-size: 1.15rem;
  color: var(--text-dark);
  margin-bottom: 0.45rem;
}

.activation-message-content p {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--text-medium);
}

@media (max-width: 992px) {
  .activation-hero {
    grid-template-columns: 1fr;
  }

  .verification-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .activation-hero-content,
  .activation-progress-card,
  .verification-card,
  .activation-message-card {
    border-radius: 20px;
  }

  .activation-hero-content,
  .activation-progress-card,
  .verification-card,
  .activation-message-card {
    padding: 1.25rem;
  }

  .activation-title {
    font-size: 1.6rem;
  }

  .activation-message-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .activation-progress-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
