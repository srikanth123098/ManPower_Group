import React, { useState } from 'react';
import './CourseRoadmap.css';

export default function CourseRoadmap() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="course-iframe-wrapper">
      {isLoading && (
        <div className="iframe-loading">
          <div className="loading-spinner"></div>
          <p>Loading course content...</p>
        </div>
      )}
      <iframe
        src="https://contentcourse.ccbp.tech/"
        className="course-iframe"
        title="Content Analyst Course"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={handleLoad}
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
      />
    </div>
  );
}
