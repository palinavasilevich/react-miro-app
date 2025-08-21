import { startTransition, useOptimistic } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { rqClient } from "@/shared/api/instance";

export function useUpdateFavoriteBoards() {
  const queryClient = useQueryClient();

  const [favorite, setFavorite] = useOptimistic<Record<string, boolean>>({});

  const updateFavoriteBoardsMutation = rqClient.useMutation(
    "put",
    "/boards/{boardId}/favorite",
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(
          rqClient.queryOptions("get", "/boards"),
        );
      },
    },
  );

  const toggle = (board: { id: string; isFavorite: boolean }) => {
    startTransition(async () => {
      setFavorite((prev) => ({
        ...prev,
        [board.id]: !board.isFavorite,
      }));
      await updateFavoriteBoardsMutation.mutateAsync({
        params: { path: { boardId: board.id } },
        body: { isFavorite: !board.isFavorite },
      });
    });
  };

  const isOptimisticFavorite = (board: { id: string; isFavorite: boolean }) =>
    favorite[board.id] ?? board.isFavorite;

  return { toggle, isOptimisticFavorite };
}
