import { useNavigate } from "react-router-dom";
import { rqClient } from "@/shared/api/instance";
import { ROUTES } from "@/shared/model/routes";
import type { ApiSchemas } from "@/shared/api/schema";

export function useRegister() {
  const navigate = useNavigate();
  const registerMutation = rqClient.useMutation("post", "/auth/register", {
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
  });

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
