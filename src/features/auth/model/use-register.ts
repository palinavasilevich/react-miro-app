import { useNavigate } from "react-router-dom";
import { publicRqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import type { ApiSchemas } from "@/shared/api/schema";
import { useSession } from "@/shared/model/session";

export function useRegister() {
  const navigate = useNavigate();
  const session = useSession();

  const registerMutation = publicRqClient.useMutation(
    "post",
    "/auth/register",
    {
      onSuccess: (data) => {
        session.login(data.accessToken);
        navigate(ROUTES.LOGIN);
      },
    },
  );

  const register = (data: ApiSchemas["RegisterRequest"]) => {
    registerMutation.mutate({ body: data });
  };

  const errorMessage = registerMutation.isError
    ? registerMutation.error.message
    : undefined;

  return {
    register,
    isPending: registerMutation.isPending,
    errorMessage,
  };
}
