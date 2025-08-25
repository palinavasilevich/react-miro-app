import { useState } from "react";
import { useBoardsList } from "./model/use-boards-list";

import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavoriteBoards } from "./model/use-update-favorite-boards";
import {
  BoardsListLayout,
  BoardsListLayoutHeader,
  BoardsListLayoutContent,
} from "./ui/boards-list-layout";
import { ViewModeToggle, type ViewMode } from "./ui/view-mode-toggle";

import { BoardsListCard } from "./ui/boards-list-card";
import { BoardsFavoriteToggle } from "./ui/boards-favorite-toggle";
import { Button } from "@/shared/ui/kit/button";
import { TrashIcon } from "lucide-react";

function BoardsListFavoritePage() {
  const boardsQuery = useBoardsList({
    isFavorite: true,
  });

  const [viewModeValue, setViewModeValue] = useState<ViewMode>("list");

  const deleteBoardMutation = useDeleteBoard();
  const updateFavoriteBoardsMutation = useUpdateFavoriteBoards();

  const boards = boardsQuery.boards.filter((board) =>
    updateFavoriteBoardsMutation.isOptimisticFavorite(board),
  );

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="Favorite Boards"
          description="Here you can view and manage your favorite boards"
          actions={
            <ViewModeToggle value={viewModeValue} onChange={setViewModeValue} />
          }
        />
      }
    >
      <BoardsListLayoutContent
        isPending={boardsQuery.isPending}
        isEmpty={boardsQuery.boards.length === 0}
        hasCursor={boardsQuery.hasNextPage}
        isPendingNextPage={boardsQuery.isFetchingNextPage}
        cursorRef={boardsQuery.cursorRef}
        mode={viewModeValue}
        renderList={() =>
          boards.map((board) => (
            <BoardsListCard
              key={board.id}
              board={board}
              rightTopActions={
                <BoardsFavoriteToggle
                  isFavorite={updateFavoriteBoardsMutation.isOptimisticFavorite(
                    board,
                  )}
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
          ))
        }
        renderGrid={() =>
          boards.map((board) => (
            <BoardsListCard
              key={board.id}
              board={board}
              rightTopActions={
                <BoardsFavoriteToggle
                  isFavorite={updateFavoriteBoardsMutation.isOptimisticFavorite(
                    board,
                  )}
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
          ))
        }
      />
    </BoardsListLayout>
  );
}

export const Component = BoardsListFavoritePage;
