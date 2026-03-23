import { useState } from "react";

type NodeBase = {
  id: string;
  type: string;
};

type StickerNode = NodeBase & {
  type: "sticker";
  text: string;
  x: number;
  y: number;
};

type Node = StickerNode;

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      type: "sticker",
      text: "Hello 1",
      x: 100,
      y: 100,
    },
    {
      id: "2",
      type: "sticker",
      text: "Hello 2",
      x: 200,
      y: 200,
    },
  ]);

  const addSticker = (data: { text: string; x: number; y: number }) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "sticker",
      ...data,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const updateStickerText = (id: string, text: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === id ? { ...node, text } : node)),
    );
  };

  const deleteNodes = (ids: string[]) => {
    setNodes((prevNodes) => prevNodes.filter((node) => !ids.includes(node.id)));
  };

  return { nodes, addSticker, updateStickerText, deleteNodes };
}

export type NodesModel = ReturnType<typeof useNodes>;
