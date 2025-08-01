import React, { useState, useEffect, useRef } from 'react';
import OnboardingProgress from './OnboardingProgress';
import OnboardingTooltip from './OnboardingTooltip';
import { useUser, useAuth } from '@clerk/clerk-react';

// Onboarding steps configuration for your BranchOut app
const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to BranchOut!',
    content: 'Let\'s take a quick tour to help you discover amazing repositories tailored to your interests.',
    target: null,
    position: 'center'
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
    id: 'profile',
    title: 'Your Profile',
    content: 'Click here to manage your account information and view your current preferences.',
    target: '.profile-avatar',
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

// Main Onboarding System Component
const OnboardingSystem = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
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

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Don't run if no user or already checked
      if (!user || !userId || hasCheckedOnboarding) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Get token (works for both Clerk and localStorage auth)
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
        
        console.log('User data received:', userData); // Debug log
        
        // Check if onboarding is completed - handle different response structures
        const hasCompleted = userData?.hasCompletedOnboarding || 
                           userData?.user?.hasCompletedOnboarding || 
                           false;
        
        console.log('Has completed onboarding:', hasCompleted); // Debug log
        
        setHasCheckedOnboarding(true);
        
        // Only show onboarding if user hasn't completed it
        if (!hasCompleted) {
          console.log('Starting onboarding tour...'); // Debug log
          setTimeout(() => setIsActive(true), 1500);
        } else {
          console.log('Onboarding already completed, skipping tour'); // Debug log
        }
        
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, don't show onboarding to avoid annoying users
        setHasCheckedOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, userId, clerkUser, getToken, hasCheckedOnboarding]);

  // Handle keyboard navigation
  useEffect(() => {
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
  }, [isActive, currentStepIndex]);

  const handleNext = () => {
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
    handleComplete();
  };

  const handleClose = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    setIsActive(false);
    
    // Update backend to mark onboarding as completed
    try {
      const token = clerkUser ? await getToken() : localStorage.getItem("authToken");
      
      if (!token) {
        console.error('No auth token available for updating onboarding status');
        return;
      }

      console.log('Attempting to update onboarding status...'); // Debug log
      console.log('User ID:', userId); // Debug log
      console.log('Token exists:', !!token); // Debug log

      const requestBody = { hasCompletedOnboarding: true };
      console.log('Request body:', requestBody); // Debug log

      const response = await fetch(`${import.meta.env.VITE_DATABASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Onboarding status updated successfully:', result); // Debug log
      
      // Check if the immediate response contains the updated field
      const immediateCheck = result?.hasCompletedOnboarding || result?.user?.hasCompletedOnboarding;
      console.log('Immediate response hasCompletedOnboarding:', immediateCheck);
      
      // Mark as checked so it won't run again in this session
      setHasCheckedOnboarding(true);
      
      // Verify the update worked by checking the profile again
      setTimeout(async () => {
        try {
          const verifyResponse = await fetch(`${import.meta.env.VITE_DATABASE_URL}/user/profile`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const verifyData = await verifyResponse.json();
          console.log('Verification - Updated user data:', verifyData);
          console.log('Verification - hasCompletedOnboarding is now:', verifyData?.hasCompletedOnboarding || verifyData?.user?.hasCompletedOnboarding);
          
          // Check all possible locations where the field might be
          console.log('Field locations check:');
          console.log('- verifyData.hasCompletedOnboarding:', verifyData.hasCompletedOnboarding);
          console.log('- verifyData.user?.hasCompletedOnboarding:', verifyData.user?.hasCompletedOnboarding);
          console.log('- verifyData.profile?.hasCompletedOnboarding:', verifyData.profile?.hasCompletedOnboarding);
          console.log('- verifyData.data?.hasCompletedOnboarding:', verifyData.data?.hasCompletedOnboarding);
          
        } catch (verifyError) {
          console.error('Error verifying update:', verifyError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const startOnboarding = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const resetOnboarding = async () => {
    // Reset onboarding status in database
    try {
      const token = clerkUser ? await getToken() : localStorage.getItem("authToken");
      
      if (token) {
        console.log('Resetting onboarding status in database...');
        
        const response = await fetch(`${import.meta.env.VITE_DATABASE_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ hasCompletedOnboarding: false })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Reset response error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Onboarding status reset:', result);
      }
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
    }
    
    // Reset local state
    setHasCheckedOnboarding(false);
    startOnboarding();
  };

  // Don't render anything while loading
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
          gap: '8px'
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
            Start Tour
          </button>
          <button
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
      />
    </>
  );
};

export default OnboardingSystem;