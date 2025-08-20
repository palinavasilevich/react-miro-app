import { Link, href } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { rqClient } from "@/shared/api/instance";
import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";
import { Switch } from "@/shared/ui/kit/switch";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import { type ApiSchemas } from "@/shared/api/schema";
import { useBoardsList } from "./use-boards-list";
import { useBoardsFilters, type BoardsSortOption } from "./use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";

function BoardsListPage() {
  const queryClient = useQueryClient();

  const boardsFilters = useBoardsFilters();
  const boardsQuery = useBoardsList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 300),
  });

  const createBoardMutation = rqClient.useMutation("post", "/boards", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/boards"),
      );
    },
  });

  const deleteBoardMutation = rqClient.useMutation(
    "delete",
    "/boards/{boardId}",
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(
          rqClient.queryOptions("get", "/boards"),
        );
      },
    },
  );

  const toggleFavoriteMutation = rqClient.useMutation(
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

  const handleToggleFavorite = (board: ApiSchemas["Board"]) => {
    toggleFavoriteMutation.mutate({
      params: { path: { boardId: board.id } },
      body: { isFavorite: !board.isFavorite },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Boards {CONFIG.API_BASE_URL}</h1>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Enter board name..."
            value={boardsFilters.search}
            onChange={(e) => boardsFilters.setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="sort">Sort</Label>
          <Select
            value={boardsFilters.sort}
            onValueChange={(value) =>
              boardsFilters.setSort(value as BoardsSortOption)
            }
          >
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastOpenedAt">By date opened</SelectItem>
              <SelectItem value="createdAt">By date created</SelectItem>
              <SelectItem value="updatedAt">By date updated</SelectItem>
              <SelectItem value="name">By name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All boards</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-8">
        <form
          className="flex gap-4 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            createBoardMutation.mutate({});
            e.currentTarget.reset();
          }}
        >
          <div className="flex-grow">
            <Label htmlFor="board-name">Name of the new board</Label>
            <Input
              id="board-name"
              name="name"
              placeholder="Enter name of board..."
            />
          </div>
          <Button type="submit" disabled={createBoardMutation.isPending}>
            Create board
          </Button>
        </form>
      </div>

      {boardsQuery.isPending ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardsQuery.boards.map((board) => (
              <Card key={board.id} className="relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <Switch
                    checked={board.isFavorite}
                    onCheckedChange={() => handleToggleFavorite(board)}
                  />
                  {/* <span className="text-sm text-gray-500">
                    {board.isFavorite ? "In favorites" : ""}
                  </span> */}
                </div>
                <CardHeader>
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="link"
                      className="text-left justify-start h-auto p-0"
                    >
                      <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
                        <span className="text-xl font-medium">
                          {board.name}
                        </span>
                      </Link>
                    </Button>
                    <div className="text-sm text-gray-500">
                      Created at:{" "}
                      {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last opened at:{" "}
                      {new Date(board.lastOpenedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="destructive"
                    disabled={deleteBoardMutation.isPending}
                    onClick={() =>
                      deleteBoardMutation.mutate({
                        params: { path: { boardId: board.id } },
                      })
                    }
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {boardsQuery.boards.length === 0 && !boardsQuery.isPending && (
            <div className="text-center py-10">No boards found</div>
          )}

          {boardsQuery.hasNextPage && (
            <div ref={boardsQuery.cursorRef} className="text-center py-8">
              {boardsQuery.isFetchingNextPage && "Loading more boards..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const Component = BoardsListPage;
