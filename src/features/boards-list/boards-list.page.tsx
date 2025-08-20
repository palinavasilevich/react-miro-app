import { useState, useEffect, useRef, useCallback } from "react";
import { Link, href } from "react-router-dom";
import { rqClient } from "@/shared/api/instance";
import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/shared/ui/kit/select";
import { Switch } from "@/shared/ui/kit/switch";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import { type ApiSchemas } from "@/shared/api/schema";

type BoardsSortOption = "createdAt" | "updatedAt" | "lastOpenedAt" | "name";

function BoardsListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<BoardsSortOption>("lastOpenedAt");
  const [showFavorites, setShowFavorites] = useState<boolean | null>(null);
  const [boards, setBoards] = useState<ApiSchemas["Board"][]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset the page when the search changes
      setBoards([]); // Clear the board list when a new search occurs
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page and board list when changing filters and sorting
  useEffect(() => {
    setPage(1);
    setBoards([]);
  }, [sort, showFavorites]);

  const boardsQuery = rqClient.useQuery("get", "/boards", {
    params: {
      query: {
        page,
        limit: 20,
        sort,
        search: debouncedSearch || undefined,
        isFavorite: showFavorites,
      },
    },
    enabled: true,
  });

  // Update the list of boards when new data is received
  useEffect(() => {
    if (boardsQuery.data?.list) {
      if (page === 1) {
        setBoards(boardsQuery.data.list);
      } else {
        setBoards((prev) => [...prev, ...boardsQuery.data.list]);
      }
      setHasMore(page < (boardsQuery.data.totalPages || 1));
      setIsLoadingMore(false);
    }
  }, [boardsQuery.data, page]);

  // Function to load the next page
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !boardsQuery.isPending) {
      setIsLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoadingMore, hasMore, boardsQuery.isPending]);

  // Setting up IntersectionObserver for infinite scrolling
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMore, hasMore]);

  const createBoardMutation = rqClient.useMutation("post", "/boards", {
    onSettled: async () => {
      await queryClient.invalidateQueries(
        rqClient.queryOptions("get", "/boards"),
      );
      setPage(1);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="sort">Sort</Label>
          {/* <Select
            value={sort}
            onValueChange={(value) => setSort(value as BoardsSortOption)}
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
          </Select> */}
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setShowFavorites(null)}>
            All boards
          </TabsTrigger>
          <TabsTrigger value="favorites" onClick={() => setShowFavorites(true)}>
            Favorites
          </TabsTrigger>
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

      {boardsQuery.isPending && page === 1 ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Card key={board.id} className="relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <Switch
                    checked={board.isFavorite}
                    onCheckedChange={() => handleToggleFavorite(board)}
                  />
                  <span className="text-sm text-gray-500">
                    {board.isFavorite ? "В избранном" : ""}
                  </span>
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

          {boards.length === 0 && !boardsQuery.isPending && (
            <div className="text-center py-10">No boards found</div>
          )}

          {hasMore && (
            <div ref={loadMoreRef} className="text-center py-8">
              {isLoadingMore && "Loading more boards..."}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const Component = BoardsListPage;
