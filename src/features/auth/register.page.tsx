import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";
import { ROUTES } from "@/shared/model/routes";

function RegisterPage() {
  return (
    <AuthLayout
      title="Sign Up"
      description="Enter your email and password password to register"
      footerText={
        <>
          Do you already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
        </>
      }
    >
      <form></form>
    </AuthLayout>
  );
}

export const Component = RegisterPage;
