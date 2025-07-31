import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";
import fullLogo from "../../assets/logo/fullLogo.png"


// ...imports remain unchanged

function AuthComponent() {
  const { user, isLoaded } = useUser();
  const { openSignIn, openSignUp } = useClerk();
  const [authMode, setAuthMode] = useState("local");
  const location = useLocation();
  const navigate = useNavigate();
  const isSignUp = location.pathname === "/signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localUser, setLocalUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const from = location.state?.from?.pathname || "/discovery";

  const VITE_URL = import.meta.env.VITE_DATABASE_URL

  useEffect(() => {
    const restoreSession = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && userData) {
        try {
          setLocalUser(JSON.parse(userData));
        } catch {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (isLoaded && user) navigate(from, { replace: true });
  }, [isLoaded, user, navigate, from]);

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`${VITE_URL}/auth/clerkSync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username || user.firstName || user.id,
        }),
      })
        .then(res => res.json())
        .then(data =>
          localStorage.setItem("userData", JSON.stringify(data.user))
        )
        .catch(console.error);
    }
  }, [isLoaded, user]);

  if (isLoading || !isLoaded) return <div>Loading session...</div>;

  if (user || localUser) {
    const displayUser = user || localUser;
    return (
      <div className="auth-container">
        <h2>✅ Logged in as: {displayUser.username || displayUser.email}</h2>
        <p>Auth Type: {user ? "OAuth (Clerk)" : "Local Database"}</p>
        <p>Account Role: {displayUser?.role || "USER"}</p>
        {user && <p>Clerk ID: {user.id}</p>}
        {localUser && <p>Local ID: {localUser.id}</p>}
        <button className="btn btn-danger" onClick={async () => {
          if (user) await signOut();
          localStorage.clear();
          setLocalUser(null);
          navigate("/login");
        }}>
          Sign Out
        </button>
      </div>
    );
  }

  const handleLocalAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignUp ? "/auth/signup" : "/auth/login";
      const requestBody = isSignUp
        ? { username, email, password }
        : { username, password };

      const response = await fetch(`${VITE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        const userData = {
          id: result.user?.id,
          username: result.user?.username,
          email: result.user?.email,
          role: result.user?.role,
        };
        setLocalUser(userData);
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/");
      } else {
        setError(`Authentication failed: ${result.message || "Try again."}`);
      }
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = "auth-wrapper">
    <div className="auth-container">
        <img src = {fullLogo} className = "loginSignupLogo"/>
        {/* <h2 className = "auth-title">{isSignUp ? "Create Account" : " Login"}</h2> */}
      {/* Auth Mode Tabs */}
      {/* <div className="auth-tabs">
        <button
          className={`tab ${authMode === "local" ? "active" : ""}`}
          onClick={() => setAuthMode("local")}
        >
          Local Account
        </button>
        <button
          className={`tab ${authMode === "oauth" ? "active" : ""}`}
          onClick={() => setAuthMode("oauth")}
        >
          OAuth (Google, GitHub, etc.)
        </button>
      </div> */}

      {authMode === "local" ? (
        <form onSubmit={handleLocalAuth} className="auth-form">

          {error && <div className="error-box">{error}</div>}

          {isSignUp && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            required
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "⏳ Processing..."
              : isSignUp
              ? "Create Account"
              : "Login"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setError("");
              setEmail("");
              setPassword("");
              setUsername("");
              navigate(isSignUp ? "/login" : "/signup");
            }}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Need an account? Sign Up"}
          </button>
        </form>
      ) : (
        <div className="auth-form">
          {/* <h2 style={{ textAlign: "center" }}>🔗 OAuth Registration</h2> */}

          <button className="btn btn-primary" onClick={() => {
            navigate("/signup");
            openSignUp();
          }}>
          Sign Up with OAuth 🚀
          </button>

          <button className="btn btn-secondary" onClick={() => {
            navigate("/login");
            openSignIn();
          }}>
          Login with OAuth 🔑
          </button>

          <div className="info-box">
            <p>
              OAuth will open a popup for Google, GitHub, or other providers.
              Your account is securely managed by Clerk.
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default AuthComponent;


