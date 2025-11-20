import React from 'react';
import './CourseRoadmap.css';

export default function CourseRoadmap() {
  return (
    <div className="course-iframe-wrapper">
      <iframe
        src="https://contentcourse.ccbp.tech/"
        className="course-iframe"
        title="Content Analyst Course"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
