import React, { useState, useEffect, useRef } from 'react';
import OnboardingProgress from './OnboardingProgress';
import OnboardingTooltip from './OnboardingTooltip';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useMediaQuery } from '@mui/material';

// Mobile and Desktop onboarding steps
const DESKTOP_ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to BranchOut!',
    content: 'Let\'s take a quick tour to help you discover amazing repositories tailored to your interests.',
    target: null,
    position: 'center'
  },
    {
    id: 'profile',
    title: 'Your Profile',
    content: 'Click here to manage your account information and view your current preferences.',
    target: '.profile-avatar',
    position: 'right'
  },
  {
    id: 'discovery',
    title: 'Discovery Page',
    content: 'This is where you\'ll find personalized repository recommendations. Swipe right to save repos you like, left to pass!',
    target: '[href="/discovery"]',
    position: 'right'
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    content: 'Configure your skill level, preferred languages, and topics to get better recommendations.',
    target: '[href="/preferences"]',
    position: 'right'
  },
  {
    id: 'saved-repos',
    title: 'Saved Repositories',
    content: 'All your liked repositories will appear here for easy access and future reference.',
    target: '[href="/savedrepos"]',
    position: 'right'
  },
  {
    id: 'repo-interaction',
    title: 'Repository Cards',
    content: 'Swipe left to dislike, right to save. Click on cards for detailed information. Use keyboard arrows or A/D keys too!',
    target: '.repo-card',
    position: 'left'
  }
];

const MOBILE_ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to BranchOut!',
    content: 'Let\'s take a quick tour to help you discover amazing repositories tailored to your interests.',
    target: null,
    position: 'center'
  },
  {
    id: 'mobile-menu',
    title: 'Navigation Menu',
    content: 'Tap the menu button in the top-right corner to access navigation options.',
    target: '.mobile-menu-button, button[aria-label="menu"]',
    position: 'bottom',
    requiresMenuOpen: false,
    action: 'openMenu'
  },
    {
    id: 'profile-mobile',
    title: 'Your Profile',
    content: 'Manage your account information and view your current preferences.',
    target: '.nav-item-profile, [data-nav="profile"]',
    position: 'left',
    requiresMenuOpen: true
  },
  {
    id: 'discovery-mobile',
    title: 'Discovery Page',
    content: 'Find personalized repository recommendations here. On mobile, swipe or tap the icons to interact with repos.',
    target: '.nav-item-discovery, [data-nav="discovery"]',
    position: 'left',
    requiresMenuOpen: true
  },
  {
    id: 'search-mobile',
    title: 'Search Repos',
    content: 'Search for specific repositories using filters and keywords.',
    target: '.nav-item-search, [data-nav="search"]',
    position: 'left',
    requiresMenuOpen: true
  },
  {
    id: 'preferences-mobile',
    title: 'Your Preferences',
    content: 'Set your skill level, preferred languages, and topics for better recommendations.',
    target: '.nav-item-preferences, [data-nav="preferences"]',
    position: 'left',
    requiresMenuOpen: true
  },
  {
    id: 'saved-repos-mobile',
    title: 'Saved Repositories',
    content: 'Access all your liked repositories from here.',
    target: '.nav-item-saved, [data-nav="saved"]',
    position: 'left',
    requiresMenuOpen: true
  },
  {
    id: 'repo-interaction-mobile',
    title: 'Repository Cards',
    content: 'Swipe left to dislike, right to save. Tap cards for more details. On mobile, you can also use the action buttons!',
    target: '.repo-card',
    position: 'top'
  }
];

// Main Onboarding System Component
const OnboardingSystem = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  
  // Responsive detection
  const isMobile = useMediaQuery('(max-width: 768px)');
  const ONBOARDING_STEPS = isMobile ? MOBILE_ONBOARDING_STEPS : DESKTOP_ONBOARDING_STEPS;
  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  
  // Get user data
  const localUser = (() => {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();
  
  const user = clerkUser || localUser;
  const userId = user?.id;

  // Handle menu state for mobile onboarding
const handleMenuAction = (action) => {
  if (action === 'openMenu') {
    const menuButton = document.querySelector('button[aria-label="menu"]') || 
                      document.querySelector('.MuiIconButton-root');
    if (menuButton && window.innerWidth <= 430) {
      menuButton.click();
      setMenuIsOpen(true);
    }
  } else if (action === 'closeMenu') {
    // Click outside the menu to close it
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      backdrop.click();
    } else {
      // Alternative: press escape key
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    }
    setMenuIsOpen(false);
  }
};

  // Check if current step requires menu to be open and handle it
  useEffect(() => {
    if (!isActive || !currentStep) return;

    if (currentStep.action) {
      setTimeout(() => {
        handleMenuAction(currentStep.action);
      }, 500);
    }

    // For steps that require menu to be open, ensure it's open
    if (currentStep.requiresMenuOpen && !menuIsOpen) {
      setTimeout(() => {
        handleMenuAction('openMenu');
      }, 300);
    }

    // For steps that require menu to be closed, ensure it's closed
    if (currentStep.requiresMenuOpen === false && menuIsOpen) {
      setTimeout(() => {
        handleMenuAction('closeMenu');
      }, 300);
    }
  }, [currentStepIndex, isActive, currentStep]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || !userId || hasCheckedOnboarding) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const token = clerkUser ? await getToken() : localStorage.getItem("authToken");
        
        if (!token) {
          console.log('No auth token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_DATABASE_URL}/user/profile`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        const hasCompleted = userData?.hasCompletedOnboarding || 
                           userData?.user?.hasCompletedOnboarding || 
                           false;
        
        setHasCheckedOnboarding(true);
        
        if (!hasCompleted) {
          console.log(`Starting ${isMobile ? 'mobile' : 'desktop'} onboarding tour...`);
          setTimeout(() => setIsActive(true), 1500);
        } else {
          console.log('Onboarding already completed, skipping tour');
        }
        
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCheckedOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, userId, clerkUser, getToken, hasCheckedOnboarding, isMobile]);

  // Handle keyboard navigation (disable on mobile for touch interactions)
  useEffect(() => {
    if (isMobile) return; // Disable keyboard navigation on mobile
    
    const handleKeyDown = (e) => {
      if (!isActive) return;
      
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStepIndex, isMobile]);

const handleNext = () => {
  // Close menu before showing repo card step
  if (currentStep?.id === 'close-menu' || 
      (currentStepIndex === ONBOARDING_STEPS.length - 2 && isMobile)) {
    handleMenuAction('closeMenu');
  }
  
  if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
    setCurrentStepIndex(prev => prev + 1);
  } else {
    handleComplete();
  }
};

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    // Close mobile menu if open before completing
    if (isMobile && menuIsOpen) {
      handleMenuAction('closeMenu');
    }
    handleComplete();
  };

  const handleClose = () => {
    // Close mobile menu if open before completing
    if (isMobile && menuIsOpen) {
      handleMenuAction('closeMenu');
    }
    handleComplete();
  };

  const handleComplete = async () => {
    setIsActive(false);
    
    // Close mobile menu if it's open
    if (isMobile && menuIsOpen) {
      handleMenuAction('closeMenu');
    }
    
    // Update backend to mark onboarding as completed
    try {
      const token = clerkUser ? await getToken() : localStorage.getItem("authToken");
      
      if (!token) {
        console.error('No auth token available for updating onboarding status');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_DATABASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ hasCompletedOnboarding: true })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Onboarding status updated successfully:', result);
      setHasCheckedOnboarding(true);
      
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const startOnboarding = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const resetOnboarding = async () => {
    try {
      const token = clerkUser ? await getToken() : localStorage.getItem("authToken");
      
      if (token) {
        const response = await fetch(`${import.meta.env.VITE_DATABASE_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ hasCompletedOnboarding: false })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
    
    setHasCheckedOnboarding(false);
    setMenuIsOpen(false);
    startOnboarding();
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Demo Controls - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          gap: '8px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* <button
            onClick={startOnboarding}
            style={{
              padding: '12px 16px',
              backgroundColor: '#E34714',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Start {isMobile ? 'Mobile' : 'Desktop'} Tour
          </button> */}
          {/* <button
            onClick={resetOnboarding}
            style={{
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#E34714',
              border: '1px solid #E34714',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reset
          </button> */}
        </div>
      )}

      <OnboardingProgress
        currentStep={currentStepIndex + 1}
        totalSteps={ONBOARDING_STEPS.length}
        isVisible={isActive}
      />

      <OnboardingTooltip
        step={currentStep}
        onNext={handleNext}
        onPrev={currentStepIndex > 0 ? handlePrev : null}
        onSkip={handleSkip}
        onClose={handleClose}
        isVisible={isActive}
        isMobile={isMobile}
      />
    </>
  );
};

export default OnboardingSystem;