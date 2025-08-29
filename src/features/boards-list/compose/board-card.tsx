import { BoardsListCard } from "../ui/boards-list-card";
import { useDeleteBoard } from "../model/use-delete-board";
import { useUpdateFavoriteBoards } from "../model/use-update-favorite-boards";
import { ApiSchemas } from "@/shared/api/schema";
import { BoardsFavoriteToggle } from "../ui/boards-favorite-toggle";
import { Button } from "@/shared/ui/kit/button";
import { TrashIcon } from "lucide-react";

type BoardCardProps = {
  board: ApiSchemas["Board"];
};

export function BoardCard({ board }: BoardCardProps) {
  const deleteBoardMutation = useDeleteBoard();
  const updateFavoriteBoardsMutation = useUpdateFavoriteBoards();

  return (
    <BoardsListCard
      board={board}
      rightTopActions={
        <BoardsFavoriteToggle
          isFavorite={updateFavoriteBoardsMutation.isOptimisticFavorite(board)}
          onToggle={() => updateFavoriteBoardsMutation.toggle(board)}
        />
      }
      bottomActions={
        <Button
          variant="destructive"
          disabled={deleteBoardMutation.getIsPending(board.id)}
          onClick={() => deleteBoardMutation.deleteBoard(board.id)}
        >
          <TrashIcon />
          Delete
        </Button>
      }
    />
  );
}
