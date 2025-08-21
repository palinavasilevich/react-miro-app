import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardHeader, CardFooter } from "@/shared/ui/kit/card";
import { StarIcon } from "lucide-react";
import type { ApiSchemas } from "@/shared/api/schema";

type BoardsListCardProps = {
  board: ApiSchemas["Board"];
  isDeletePending: boolean;
  isFavorite: boolean;
  onFavoriteToggle: (board: ApiSchemas["Board"]) => void;
  onDelete: (boardId: string) => void;
};

export function BoardsListCard({
  board,
  isFavorite,
  isDeletePending,
  onFavoriteToggle,
  onDelete,
}: BoardsListCardProps) {
  return (
    <Card className="relative">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 cursor-pointer hover:bg-transparent "
          onClick={() => onFavoriteToggle(board)}
        >
          <StarIcon fill={isFavorite ? "#8200db" : "transparent"} />
        </Button>
      </div>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <Button
            asChild
            variant="link"
            className="text-left justify-start h-auto p-0"
          >
            <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
              <span className="text-xl font-medium">{board.name}</span>
            </Link>
          </Button>
          <div className="text-sm text-gray-500">
            Created at: {new Date(board.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-500">
            Last opened at: {new Date(board.lastOpenedAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardFooter>
        <Button
          variant="destructive"
          disabled={isDeletePending}
          onClick={() => onDelete(board.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
