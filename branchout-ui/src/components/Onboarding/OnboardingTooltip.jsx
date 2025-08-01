import React, { useState, useEffect, useRef } from 'react';


const OnboardingTooltip = ({ step, onNext, onPrev, onSkip, onClose, isVisible }) => {
  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!step || !isVisible) return;

    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        setTargetElement(element);
        calculatePosition(element);
      }
    } else {
      setTargetElement(null);
      setTooltipPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
    }
  }, [step, isVisible]);

  const calculatePosition = (element) => {
    if (!element || !tooltipRef.current) return;

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const padding = 16;

    let top, left, transform = '';

    switch (step.position) {
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + padding;
        transform = 'translateY(-50%)';
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - tooltipRect.width - padding;
        transform = 'translateY(-50%)';
        break;
      case 'top':
        top = rect.top - tooltipRect.height - padding;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%)';
        break;
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2;
        transform = 'translateX(-50%)';
        break;
      default:
        top = rect.bottom + padding;
        left = rect.left;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 0) left = 10;
    if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 10;
    if (top < 0) top = 10;
    if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height - 10;

    setTooltipPosition({ top, left, transform });
  };

  const getArrowStyles = () => {
    if (!step.target) return {};
    
    const arrowSize = 8;
    switch (step.position) {
      case 'right':
        return {
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderRight: `${arrowSize}px solid #1e1e1e`,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`
        };
      case 'left':
        return {
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderLeft: `${arrowSize}px solid #1e1e1e`,
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`
        };
      case 'top':
        return {
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderTop: `${arrowSize}px solid #1e1e1e`,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`
        };
      case 'bottom':
        return {
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottom: `${arrowSize}px solid #1e1e1e`,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`
        };
      default:
        return {};
    }
  };

  if (!isVisible || !step) return null;

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 9998,
        pointerEvents: 'auto'
      }}>
        {targetElement && (
          <div style={{
            position: 'absolute',
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            borderRadius: '8px',
            boxShadow: '0 0 0 4px rgba(232, 63, 37, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.8)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          ...tooltipPosition,
          zIndex: 9999,
          maxWidth: '350px',
          padding: '24px',
          backgroundColor: '#1e1e1e',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '2px solid #E34714',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Arrow */}
        <div style={{
          position: 'absolute',
          width: 0,
          height: 0,
          ...getArrowStyles(),
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ✕
        </button>

        {/* Content */}
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontWeight: 'bold', 
          fontSize: '18px',
          paddingRight: '32px'
        }}>
          {step.title}
        </h3>
        
        <p style={{ 
          margin: '0 0 24px 0', 
          color: '#ccc', 
          lineHeight: '1.5',
          fontSize: '14px'
        }}>
          {step.content}
        </p>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '8px 12px'
            }}
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onPrev && (
              <button
                onClick={onPrev}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid #E34714',
                  color: '#E34714',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ← Back
              </button>
            )}
            
            <button
              onClick={onNext}
              style={{
                padding: '8px 16px',
                backgroundColor: '#E34714',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {step.id === 'repo-interaction' ? 'Finish' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTooltip;