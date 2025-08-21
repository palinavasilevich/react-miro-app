import { useState } from "react";
import { useBoardsList } from "./model/use-boards-list";
import { useBoardsFilters } from "./model/use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavoriteBoards } from "./model/use-update-favorite-boards";
import {
  BoardsListLayout,
  BoardsListLayoutHeader,
  BoardsListLayoutContent,
  BoardsListListLayout,
  BoardsListCardsLayout,
} from "./ui/boards-list-layout";
import { ViewModeToggle, type ViewMode } from "./ui/view-mode-toggle";

import { BoardsListCard } from "./ui/boards-list-card";

function BoardsListFavoritePage() {
  const boardsFilters = useBoardsFilters();
  const boardsQuery = useBoardsList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 300),
  });

  const [viewModeValue, setViewModeValue] = useState<ViewMode>("list");

  const deleteBoardMutation = useDeleteBoard();
  const updateFavoriteBoardsMutation = useUpdateFavoriteBoards();

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
      >
        {viewModeValue === "list" ? (
          <BoardsListListLayout>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={updateFavoriteBoardsMutation.isOptimisticFavorite(
                  board,
                )}
                onFavoriteToggle={updateFavoriteBoardsMutation.toggle}
                onDelete={deleteBoardMutation.deleteBoard}
                isDeletePending={deleteBoardMutation.getIsPending(board.id)}
              />
            ))}
          </BoardsListListLayout>
        ) : (
          <BoardsListCardsLayout>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={updateFavoriteBoardsMutation.isOptimisticFavorite(
                  board,
                )}
                onFavoriteToggle={updateFavoriteBoardsMutation.toggle}
                onDelete={deleteBoardMutation.deleteBoard}
                isDeletePending={deleteBoardMutation.getIsPending(board.id)}
              />
            ))}
          </BoardsListCardsLayout>
        )}
      </BoardsListLayoutContent>
    </BoardsListLayout>
  );
}

export const Component = BoardsListFavoritePage;
