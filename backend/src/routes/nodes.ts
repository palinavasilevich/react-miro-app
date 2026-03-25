import { Router, type Request, type Response } from "express";
import { nodesByBoard, type StickerNode } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

function getBoardNodes(boardId: string): StickerNode[] {
  if (!nodesByBoard.has(boardId)) {
    nodesByBoard.set(boardId, []);
  }
  return nodesByBoard.get(boardId)!;
}

router.get(
  "/:boardId/nodes",
  (req: Request<{ boardId: string }>, res: Response): void => {
    res.json(getBoardNodes(req.params.boardId));
  },
);

router.post(
  "/:boardId/nodes",
  (req: Request<{ boardId: string }>, res: Response): void => {
    const nodes = getBoardNodes(req.params.boardId);
    const { type, text, x, y } = req.body;
    const node: StickerNode = { id: crypto.randomUUID(), type, text, x, y };
    nodes.push(node);
    res.status(201).json(node);
  },
);

// Must be registered before /:boardId/nodes/:nodeId to avoid "positions" matching as a nodeId
router.patch(
  "/:boardId/nodes/positions",
  (req: Request<{ boardId: string }>, res: Response): void => {
    const { positions } = req.body as {
      positions: { id: string; x: number; y: number }[];
    };
    const posMap = new Map(positions.map((p) => [p.id, p]));
    const updated = getBoardNodes(req.params.boardId).map((n) => {
      const pos = posMap.get(n.id);
      return pos ? { ...n, x: pos.x, y: pos.y } : n;
    });
    nodesByBoard.set(req.params.boardId, updated);
    res.json(updated);
  },
);

router.patch(
  "/:boardId/nodes/:nodeId",
  (req: Request<{ boardId: string; nodeId: string }>, res: Response): void => {
    const nodes = getBoardNodes(req.params.boardId);
    let updated: StickerNode | null = null;
    const newNodes = nodes.map((n) => {
      if (n.id === req.params.nodeId) {
        const newNode: StickerNode = { ...n, ...req.body };
        updated = newNode;
        return newNode;
      }
      return n;
    });
    if (!updated) {
      res.status(404).json({ message: "Node not found", code: "NOT_FOUND" });
      return;
    }
    nodesByBoard.set(req.params.boardId, newNodes);
    res.json(updated);
  },
);

router.delete(
  "/:boardId/nodes",
  (req: Request<{ boardId: string }>, res: Response): void => {
    const { ids } = req.body as { ids: string[] };
    const idSet = new Set(ids);
    nodesByBoard.set(
      req.params.boardId,
      getBoardNodes(req.params.boardId).filter((n) => !idSet.has(n.id)),
    );
    res.status(204).send();
  },
);

export default router;
