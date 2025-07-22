import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const PageNotFound = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  // Check for local auth token
  const hasLocalAuth = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (!isLoaded) return;
    // Redirect only if NOT signed in with Clerk AND no local auth
    if (!isSignedIn && !hasLocalAuth) {
      navigate("/login", { replace: true });
    }
  }, [isLoaded, isSignedIn, hasLocalAuth, navigate]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="page-not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default PageNotFound;