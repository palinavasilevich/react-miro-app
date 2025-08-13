import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { AuthLayout } from "./ui/auth-layout";
import { LoginForm } from "./ui/login-form";

function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      description="Enter your email and password"
      form={<LoginForm />}
      footerText={
        <>
          Don't have an account yet? <Link to={ROUTES.REGISTER}>Sign up</Link>
        </>
      }
    ></AuthLayout>
  );
}

export const Component = LoginPage;
