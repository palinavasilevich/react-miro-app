import { useState } from "react";
import { useBoardsList } from "./model/use-boards-list";

import {
  BoardsListLayout,
  BoardsListLayoutHeader,
  BoardsListLayoutContent,
} from "./ui/boards-list-layout";
import { ViewModeToggle, type ViewMode } from "./ui/view-mode-toggle";

import { BoardItem } from "./compose/board-item";
import { BoardCard } from "./compose/board-card";
import { BoardsSidebar } from "./ui/boards-sidebar";

function BoardsListFavoritePage() {
  const boardsQuery = useBoardsList({
    isFavorite: true,
  });

  const [viewModeValue, setViewModeValue] = useState<ViewMode>("list");

  return (
    <BoardsListLayout
      sidebar={<BoardsSidebar />}
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
          boardsQuery.boards.map((board) => (
            <BoardItem key={board.id} board={board} />
          ))
        }
        renderGrid={() =>
          boardsQuery.boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))
        }
      />
    </BoardsListLayout>
  );
}

export const Component = BoardsListFavoritePage;
