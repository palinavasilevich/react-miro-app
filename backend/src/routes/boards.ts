import { Router, type Request, type Response } from "express";
import { boardsByUser, generateBoards, type Board } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

function getUserBoards(userId: string): Board[] {
  if (!boardsByUser.has(userId)) {
    boardsByUser.set(userId, generateBoards(100));
  }
  return boardsByUser.get(userId)!;
}

router.get("/", (req: Request, res: Response): void => {
  const userId = req.session!.userId;
  const boards = getUserBoards(userId);

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const search = req.query.search as string | undefined;
  const isFavorite = req.query.isFavorite as string | undefined;
  const sort = req.query.sort as string | undefined;

  let filtered = [...boards];

  if (search) {
    filtered = filtered.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (isFavorite !== undefined) {
    const fav = isFavorite === "true";
    filtered = filtered.filter((b) => b.isFavorite === fav);
  }

  if (sort) {
    filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return (
        new Date(b[sort as keyof Board] as string).getTime() -
        new Date(a[sort as keyof Board] as string).getTime()
      );
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const list = filtered.slice(start, start + limit);

  res.json({ list, total, totalPages });
});

router.get("/:boardId", (req: Request, res: Response): void => {
  const userId = req.session!.userId;
  const boards = getUserBoards(userId);
  const board = boards.find((b) => b.id === req.params.boardId);

  if (!board) {
    res.status(404).json({ message: "Board not found", code: "NOT_FOUND" });
    return;
  }

  board.lastOpenedAt = new Date().toISOString();
  res.json(board);
});

router.post("/", (req: Request, res: Response): void => {
  const userId = req.session!.userId;
  const boards = getUserBoards(userId);

  const now = new Date().toISOString();
  const board: Board = {
    id: crypto.randomUUID(),
    name: "New Board",
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
    isFavorite: false,
  };

  boards.push(board);
  res.status(201).json(board);
});

router.put("/:boardId/rename", (req: Request, res: Response): void => {
  const userId = req.session!.userId;
  const boards = getUserBoards(userId);
  const board = boards.find((b) => b.id === req.params.boardId);

  if (!board) {
    res.status(404).json({ message: "Board not found", code: "NOT_FOUND" });
    return;
  }

  board.name = req.body.name;
  board.updatedAt = new Date().toISOString();
  res.status(201).json(board);
});

router.put("/:boardId/favorite", (req: Request, res: Response): void => {
  const userId = req.session!.userId;
  const boards = getUserBoards(userId);
  const board = boards.find((b) => b.id === req.params.boardId);

  if (!board) {
    res.status(404).json({ message: "Board not found", code: "NOT_FOUND" });
    return;
  }

  board.isFavorite = req.body.isFavorite;
  board.updatedAt = new Date().toISOString();
  res.status(201).json(board);
});

router.delete("/:boardId", (req: Request, res: Response): void => {
  const userId = req.session!.userId;
  const boards = getUserBoards(userId);
  const index = boards.findIndex((b) => b.id === req.params.boardId);

  if (index === -1) {
    res.status(404).json({ message: "Board not found", code: "NOT_FOUND" });
    return;
  }

  boards.splice(index, 1);
  res.status(204).send();
});

export default router;
