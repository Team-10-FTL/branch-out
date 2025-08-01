import React, { useState, useEffect, useRef } from 'react';


const OnboardingProgress = ({ currentStep, totalSteps, isVisible }) => {
  if (!isVisible) return null;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      backgroundColor: '#1e1e1e',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: '1px solid #E34714',
      minWidth: '200px',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
        Step {currentStep} of {totalSteps}
      </div>
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#333',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#E34714',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default OnboardingProgress;