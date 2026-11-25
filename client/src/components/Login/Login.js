import { Logo } from "../NavBar/NavBar";
import "./Login.css";
import AuthCard from "../Auth/AuthCard";
import AuthForm from "../Auth/AuthForm";
import AuthFooter from "../Auth/AuthFooter";
import { loginFields } from "../../data/authFieldData";

export default function Login() {
  return (
    <AuthCard>
      <Logo />
      <LoginHeader />
      <AuthForm formFields={loginFields} submitBtnText="Sign in" type="login" message="Login" />
      <AuthFooter type="login" />
    </AuthCard>
  );
}

export function LoginHeader() {
  return (
    <header className="form-header">
      <p className="login-title">Welcome Back</p>
      <p className="login-subtitle">Sign in to access your account</p>
    </header>
  );
}
