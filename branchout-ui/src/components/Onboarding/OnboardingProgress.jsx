import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@mui/material';

const OnboardingProgress = ({ currentStep, totalSteps, isVisible }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (!isVisible) return null;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: isMobile ? '16px' : '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      backgroundColor: '#1e1e1e',
      color: 'white',
      padding: isMobile ? '10px 20px' : '12px 24px',
      borderRadius: isMobile ? '12px' : '8px',
      border: '1px solid #E34714',
      minWidth: isMobile ? '160px' : '200px',
      maxWidth: isMobile ? 'calc(100vw - 32px)' : 'none',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
      boxShadow: isMobile ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{ 
        fontSize: isMobile ? '11px' : '12px', 
        marginBottom: isMobile ? '6px' : '8px',
        fontWeight: '500'
      }}>
        Step {currentStep} of {totalSteps}
      </div>
      <div style={{
        width: '100%',
        height: isMobile ? '3px' : '4px',
        backgroundColor: '#333',
        borderRadius: isMobile ? '1.5px' : '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#E34714',
          transition: 'width 0.3s ease',
          borderRadius: 'inherit'
        }} />
      </div>
    </div>
  );
};

export default OnboardingProgress;