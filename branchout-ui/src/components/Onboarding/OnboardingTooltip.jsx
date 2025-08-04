import React, { useState, useEffect, useRef } from 'react';

const OnboardingTooltip = ({ step, onNext, onPrev, onSkip, onClose, isVisible, isMobile }) => {
  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!step || !isVisible) return;

    if (step.target) {
      // First try the exact target
      let element = document.querySelector(step.target);
      
      // If not found, try alternative selectors based on the step
      if (!element) {
        if (step.id === 'mobile-menu') {
          // Look for mobile menu button specifically
          const alternatives = [
            'button[aria-label="menu"]',
            '.MuiIconButton-root',
            '.MuiAppBar-root .MuiIconButton-root',
            'svg[data-testid="MenuIcon"]'
          ];
          
          for (const selector of alternatives) {
            element = document.querySelector(selector);
            if (element && element.offsetParent !== null) break;
          }
        } else if (step.id.includes('mobile') && step.requiresMenuOpen) {
          // For menu items, wait a bit for menu to be open
          setTimeout(() => {
            const menuItems = document.querySelectorAll('.MuiMenuItem-root');
            // Try to find the specific menu item by text content
            for (const item of menuItems) {
              const text = item.textContent?.toLowerCase();
              if (
                (step.id.includes('discovery') && text?.includes('discovery')) ||
                (step.id.includes('search') && text?.includes('search')) ||
                (step.id.includes('preferences') && text?.includes('preferences')) ||
                (step.id.includes('saved') && text?.includes('saved')) ||
                (step.id.includes('profile') && text?.includes('profile'))
              ) {
                setTargetElement(item);
                calculatePosition(item);
                return;
              }
            }
          }, 100);
          return;
        }
      }
      
      if (element) {
        setTargetElement(element);
        calculatePosition(element);
      } else {
        console.warn(`Could not find target element for: ${step.target}`);
        setTargetElement(null);
      }
    } else {
      setTargetElement(null);
      if (isMobile) {
        // Center tooltip at top of screen for mobile
        const topPosition = step.id === 'welcome' ? '90px' : '40px';

        setTooltipPosition({
          top: topPosition,
          left: '50%',
          transform: 'translateX(-50%)'
        });
      } else {
        const topPosition = step.id === 'welcome' ? '60%' : '50%';

        setTooltipPosition({
          top: topPosition,
          left: '50%',
          transform: 'translate(-50%, -50%)'
        });
      }
    }
  }, [step, isVisible, isMobile]);

  const calculatePosition = (element) => {
    if (!element || !tooltipRef.current) return;

    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const padding = isMobile ? 8 : 16; // Reduced padding for mobile

    let top, left, transform = '';

    if (isMobile) {
      // Mobile positioning - always prefer top or bottom
      switch (step.position) {
        case 'top':
          top = rect.top - tooltipRect.height - padding;
          left = '50%';
          transform = 'translateX(-50%)';
          break;
        case 'bottom':
        case 'right':
        case 'left':
        default:
          top = rect.bottom + padding;
          left = '50%';
          transform = 'translateX(-50%)';
          break;
      }

      // Ensure tooltip stays within mobile viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (top < 20) {
        top = rect.bottom + padding;
      }
      if (top + tooltipRect.height > viewportHeight - 20) {
        top = viewportHeight - tooltipRect.height - 20;
      }
    } else {
      // Desktop positioning (original logic)
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

      // Desktop viewport constraints
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 0) left = 10;
      if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 10;
      if (top < 0) top = 10;
      if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height - 10;
    }

    setTooltipPosition({ top, left, transform });
  };

  const getArrowStyles = () => {
    if (!step.target || !targetElement) return {};
    
    const arrowSize = isMobile ? 5 : 8; // Smaller arrow on mobile
    
    if (isMobile) {
      // Mobile arrows - always point up or down
      if (step.position === 'top') {
        return {
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderTop: `${arrowSize}px solid #1e1e1e`,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`
        };
      } else {
        return {
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottom: `${arrowSize}px solid #1e1e1e`,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`
        };
      }
    } else {
      // Desktop arrows (original logic)
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
        backgroundColor: isMobile ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
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
            borderRadius: isMobile ? '12px' : '8px',
            boxShadow: `0 0 0 4px rgba(232, 63, 37, 0.5), 0 0 0 9999px rgba(0, 0, 0, ${isMobile ? '0.6' : '0.8'})`,
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
          maxWidth: isMobile ? '280px' : '350px', // Smaller max width on mobile
          width: isMobile ? 'calc(100vw - 32px)' : 'auto', // Less margin on mobile
          padding: isMobile ? '16px' : '24px', // Less padding on mobile
          backgroundColor: '#1e1e1e',
          color: 'white',
          borderRadius: isMobile ? '12px' : '12px', // Slightly smaller border radius
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '2px solid #E34714',
          fontFamily: 'Inter, sans-serif',
          margin: isMobile ? '0 16px' : '0' // Less margin on mobile
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
            top: isMobile ? '12px' : '12px', // Slightly closer to edge
            right: isMobile ? '12px' : '12px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: isMobile ? '16px' : '18px', // Smaller close button
            padding: isMobile ? '4px' : '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: isMobile ? '24px' : '24px', // Smaller touch target
            minHeight: isMobile ? '24px' : '24px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ✕
        </button>

        {/* Content */}
        <h3 style={{ 
          margin: '0 0 12px 0', // Less bottom margin
          fontWeight: 'bold', 
          fontSize: isMobile ? '18px' : '18px', // Smaller title on mobile
          paddingRight: isMobile ? '32px' : '32px',
          lineHeight: isMobile ? '1.2' : '1.2' // Tighter line height
        }}>
          {step.title}
        </h3>
        
        <p style={{ 
          margin: '0 0 20px 0', // Less bottom margin
          color: '#ccc', 
          lineHeight: '1.4', // Tighter line height
          fontSize: isMobile ? '14px' : '14px' // Same size for consistency
        }}>
          {step.content}
        </p>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '0' // Less gap on mobile
        }}>
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '14px', // Smaller skip button
              padding: isMobile ? '8px 12px' : '8px 12px', // Less padding
              order: isMobile ? 2 : 1
            }}
          >
            Skip Tour
          </button>

          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '8px' : '8px', // Less gap between buttons
            order: isMobile ? 1 : 2,
            width: isMobile ? '100%' : 'auto'
          }}>
            {onPrev && (
              <button
                onClick={onPrev}
                style={{
                  padding: isMobile ? '10px 16px' : '8px 16px', // Less padding
                  backgroundColor: 'transparent',
                  border: '1px solid #E34714',
                  color: '#E34714',
                  borderRadius: isMobile ? '6px' : '6px', // Smaller border radius
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '14px', // Smaller font
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flex: isMobile ? '1' : 'none',
                  justifyContent: 'center'
                }}
              >
                ← Back
              </button>
            )}
            
            <button
              onClick={onNext}
              style={{
                padding: isMobile ? '10px 16px' : '8px 16px', // Less padding
                backgroundColor: '#E34714',
                border: 'none',
                color: 'white',
                borderRadius: isMobile ? '6px' : '6px', // Smaller border radius
                cursor: 'pointer',
                fontSize: isMobile ? '14px' : '14px', // Smaller font
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flex: isMobile ? '1' : 'none',
                justifyContent: 'center',
                fontWeight: isMobile ? '600' : 'normal'
              }}
            >
              {step.id.includes('repo-interaction') ? 'Finish' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTooltip;