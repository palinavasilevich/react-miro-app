import { Button } from "@/shared/ui/kit/button";
import { useBoardsList } from "./model/use-boards-list";
import { useBoardsFilters } from "./model/use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useCreateBoard } from "./model/use-create-board";

import { PlusIcon } from "lucide-react";
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
import { BoardCard } from "./compose/board-card";
import { BoardItem } from "./compose/board-item";
import { BoardsSidebar } from "./ui/boards-sidebar";
import {
  TemplatesGallery,
  TemplatesModal,
  useTemplatesModal,
} from "@/features/board-templates";

function BoardsListPage() {
  const boardsFilters = useBoardsFilters();
  const boardsQuery = useBoardsList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 300),
  });
  const [viewModeValue, setViewModeValue] = useState<ViewMode>("list");

  const createBoardMutation = useCreateBoard();
  const templatesModal = useTemplatesModal();

  return (
    <>
      <TemplatesModal />
      <BoardsListLayout
        templates={<TemplatesGallery />}
        sidebar={<BoardsSidebar />}
        header={
          <BoardsListLayoutHeader
            title="All Boards"
            description="Here you can view and manage your boards"
            actions={
              <>
                <Button variant="outline" onClick={templatesModal.open}>
                  Select template
                </Button>
                <Button
                  disabled={createBoardMutation.isPending}
                  onClick={createBoardMutation.createBoard}
                >
                  <PlusIcon />
                  Create board
                </Button>
              </>
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
              <ViewModeToggle
                value={viewModeValue}
                onChange={setViewModeValue}
              />
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
    </>
  );
}

export const Component = BoardsListPage;
