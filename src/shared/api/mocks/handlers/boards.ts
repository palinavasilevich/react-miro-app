import { HttpResponse } from "msw";
import { http } from "../http";
import { type ApiSchemas } from "../../schema";
import { verifyTokenOrThrow } from "../session";

const boards: ApiSchemas["Board"][] = [
  {
    id: "board-1",
    name: "Marketing Campaign",
  },
  {
    id: "board-2",
    name: "Product Roadmap",
  },
];

export const boardsHandlers = [
  http.get("/boards", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);
    return HttpResponse.json(boards);
  }),

  http.post("/boards", async (ctx) => {
    await verifyTokenOrThrow(ctx.request);
    const data = await ctx.request.json();
    const board = {
      id: crypto.randomUUID(),
      name: data.name,
    };
    boards.push(board);
    return HttpResponse.json(board);
  }),

  http.delete("/boards/{boardId}", async ({ params, request }) => {
    await verifyTokenOrThrow(request);
    const { boardId } = params;
    const boardIndex = boards.findIndex((board) => board.id === boardId);

    if (boardIndex === -1) {
      return HttpResponse.json(
        { message: "Board not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
    boards.splice(boardIndex, 1);

    return HttpResponse.json({
      message: "Board has been deleted.",
      code: "OK",
    });
  }),
];
