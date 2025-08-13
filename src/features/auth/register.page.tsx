import { Link } from "react-router-dom";
import { AuthLayout } from "./ui/auth-layout";
import { ROUTES } from "@/shared/model/routes";
import { RegisterForm } from "./ui/register-form";

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
