import { Button } from "@/shared/ui/kit/button";

import { useBoardsList } from "./model/use-boards-list";
import { useBoardsFilters } from "./model/use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useCreateBoard } from "./model/use-create-board";
import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavoriteBoards } from "./model/use-update-favorite-boards";
import { PlusIcon } from "lucide-react";
import {
  BoardsListLayout,
  BoardsListLayoutFilters,
  BoardsListLayoutHeader,
  BoardsListLayoutContent,
  BoardsListListLayout,
  BoardsListCardsLayout,
} from "./ui/boards-list-layout";
import { ViewModeToggle, type ViewMode } from "./ui/view-mode-toggle";
import { useState } from "react";
import { BoardsSortSelect } from "./ui/boards-sort-select";
import { BoardsSearchInput } from "./ui/boards-search-input";
import { BoardsListCard } from "./ui/boards-list-card";

function BoardsListPage() {
  const boardsFilters = useBoardsFilters();
  const boardsQuery = useBoardsList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 300),
  });

  const [viewModeValue, setViewModeValue] = useState<ViewMode>("list");

  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();
  const updateFavoriteBoardsMutation = useUpdateFavoriteBoards();

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="All Boards"
          description="Here you can view and manage your boards"
          actions={
            <Button
              disabled={createBoardMutation.isPending}
              onClick={createBoardMutation.createBoard}
            >
              <PlusIcon />
              Create board
            </Button>
          }
        />
      }
      filters={
        <BoardsListLayoutFilters
          filters={
            <BoardsSearchInput
              value={boardsFilters.search}
              onChange={boardsFilters.setSearch}
            />
          }
          sort={
            <BoardsSortSelect
              value={boardsFilters.sort}
              onValueChange={boardsFilters.setSort}
            />
          }
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

export const Component = BoardsListPage;
