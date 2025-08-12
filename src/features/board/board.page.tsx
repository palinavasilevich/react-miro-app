import { type PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";

function BoardPage() {
  const params = useParams<PathParams[typeof ROUTES.BOARD]>();

  return (
    <div>
      <h1>Board page</h1>
      <p>Board with id "{params.boardId}"</p>
    </div>
  );
}

export const Component = BoardPage;
