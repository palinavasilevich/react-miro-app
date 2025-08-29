import { TrashIcon } from "lucide-react";
import { BoardsFavoriteToggle } from "../ui/boards-favorite-toggle";
import { BoardsListItem } from "../ui/boards-list-item";
import { DropdownMenuItem } from "@/shared/ui/kit/dropdown-menu";
import { ApiSchemas } from "@/shared/api/schema";
import { useDeleteBoard } from "../model/use-delete-board";
import { useUpdateFavoriteBoards } from "../model/use-update-favorite-boards";

type BoardItemProps = {
  board: ApiSchemas["Board"];
};

export function BoardItem({ board }: BoardItemProps) {
  const deleteBoardMutation = useDeleteBoard();
  const updateFavoriteBoardsMutation = useUpdateFavoriteBoards();
  return (
    <BoardsListItem
      board={board}
      rightActions={
        <BoardsFavoriteToggle
          isFavorite={updateFavoriteBoardsMutation.isOptimisticFavorite(board)}
          onToggle={() => updateFavoriteBoardsMutation.toggle(board)}
        />
      }
      menuActions={
        <DropdownMenuItem
          variant="destructive"
          disabled={deleteBoardMutation.getIsPending(board.id)}
          onClick={() => deleteBoardMutation.deleteBoard(board.id)}
        >
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      }
    />
  );
}
