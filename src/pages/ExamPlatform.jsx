import React, { useState } from 'react';
import './ExamPlatform.css';

export default function ExamPlatform() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="exam-iframe-wrapper">
      {isLoading && (
        <div className="iframe-loading">
          <div className="loading-spinner"></div>
          <p>Loading exam platform...</p>
        </div>
      )}
      <iframe
        src="https://manpowerexams.ccbp.tech/"
        className="exam-iframe"
        title="Manpower Exams Platform"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleLoad}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
      />
    </div>
  );
}
