import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

// Check if user is authenticated (either Clerk or local)
const useAuth = () => {
  const { user: clerkUser } = useUser();
  const [localUser, setLocalUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocalAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          // Verify token is still valid (basic check)
          if (user && user.id) {
            setLocalUser(user);
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        } catch (e) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };

    checkLocalAuth();
  }, []);

  return {
    user: clerkUser || localUser,
    isLoading,
    isAuthenticated: !!(clerkUser || localUser)
  };
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin-only Route Component
export const AdminRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (user?.role !== 'ADMIN') {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
          ❌ Access Denied
        </h2>
        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '10px' }}>
          You don't have permission to access this page.
        </p>
        <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '30px' }}>
          Admin privileges required.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.href = '/discovery'}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Discovery
          </button>
        </div>
      </div>
    );
  }

  return children;
};