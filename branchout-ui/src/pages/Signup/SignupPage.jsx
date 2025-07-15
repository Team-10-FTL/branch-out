import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AuthComponent from "../../components/Auth/Auth";

function SignupPage() {
  console.log("hi");
  return (
    <>
      <div className="auth">
        <AuthComponent />
      </div>
    </>
  );
}

export default SignupPage;
