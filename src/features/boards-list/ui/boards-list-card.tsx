import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardHeader, CardFooter } from "@/shared/ui/kit/card";
import type { ApiSchemas } from "@/shared/api/schema";

type BoardsListCardProps = {
  board: ApiSchemas["Board"];
  rightTopActions?: React.ReactNode;
  bottomActions?: React.ReactNode;
};

export function BoardsListCard({
  board,
  rightTopActions,
  bottomActions,
}: BoardsListCardProps) {
  return (
    <Card className="relative">
      {rightTopActions && (
        <div className="absolute top-2 right-2">{rightTopActions}</div>
      )}
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
      {bottomActions && <CardFooter>{bottomActions}</CardFooter>}
    </Card>
  );
}
