import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuthComponent from "../../components/Auth/Auth";

function LoginPage() {
  return (
    <>
      <div className="auth">
        <AuthComponent />
      </div>
    </>
  );
}

export default LoginPage;
