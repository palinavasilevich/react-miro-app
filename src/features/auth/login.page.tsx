import { ROUTES } from "@/shared/model/routes";
import { Link } from "react-router-dom";
import { AuthLayout } from "./auth-layout";

function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      description="Enter your email and password"
      footerText={
        <>
          Don't have an account yet? <Link to={ROUTES.REGISTER}>Sign up</Link>
        </>
      }
    >
      <form></form>
    </AuthLayout>
  );
}

export const Component = LoginPage;
