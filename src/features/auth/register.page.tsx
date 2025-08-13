import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";
import { ROUTES } from "@/shared/model/routes";
import { RegisterForm } from "./register-form";

function RegisterPage() {
  return (
    <AuthLayout
      title="Sign Up"
      description="Enter your email and password password to register"
      form={<RegisterForm />}
      footerText={
        <>
          Do you already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </>
      }
    />
  );
}

export const Component = RegisterPage;
