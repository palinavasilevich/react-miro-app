import { Button } from "@/shared/ui/kit/button";

import { useBoardsList } from "./model/use-boards-list";
import { useBoardsFilters } from "./model/use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useCreateBoard } from "./model/use-create-board";
import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavoriteBoards } from "./model/use-update-favorite-boards";
import { TrashIcon, PlusIcon } from "lucide-react";
import {
  BoardsListLayout,
  BoardsListLayoutFilters,
  BoardsListLayoutHeader,
  BoardsListLayoutContent,
} from "./ui/boards-list-layout";
import { ViewModeToggle, type ViewMode } from "./ui/view-mode-toggle";
import { useState } from "react";
import { BoardsSortSelect } from "./ui/boards-sort-select";
import { BoardsSearchInput } from "./ui/boards-search-input";
import { BoardsListCard } from "./ui/boards-list-card";
import { BoardsFavoriteToggle } from "./ui/boards-favorite-toggle";

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
        mode={viewModeValue}
        renderList={() =>
          boardsQuery.boards.map((board) => (
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
          boardsQuery.boards.map((board) => (
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

export const Component = BoardsListPage;
