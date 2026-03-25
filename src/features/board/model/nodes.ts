import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { rqClient } from "@/shared/api/instance";

export function useNodes() {
  const { boardId } = useParams();
  const queryClient = useQueryClient();

  const nodesQueryOptions = rqClient.queryOptions(
    "get",
    "/boards/{boardId}/nodes",
    { params: { path: { boardId: boardId! } } },
  );

  const { data: nodes = [] } = rqClient.useQuery(
    "get",
    "/boards/{boardId}/nodes",
    { params: { path: { boardId: boardId! } } },
  );

  const invalidateNodes = () => queryClient.invalidateQueries(nodesQueryOptions);

  const addStickerMutation = rqClient.useMutation(
    "post",
    "/boards/{boardId}/nodes",
    { onSettled: invalidateNodes },
  );

  const updateNodeMutation = rqClient.useMutation(
    "patch",
    "/boards/{boardId}/nodes/{nodeId}",
    { onSettled: invalidateNodes },
  );

  const deleteNodesMutation = rqClient.useMutation(
    "delete",
    "/boards/{boardId}/nodes",
    { onSettled: invalidateNodes },
  );

  const updatePositionsMutation = rqClient.useMutation(
    "patch",
    "/boards/{boardId}/nodes/positions",
    { onSettled: invalidateNodes },
  );

  const addSticker = (data: { text: string; x: number; y: number }) => {
    addStickerMutation.mutate({
      params: { path: { boardId: boardId! } },
      body: { type: "sticker", ...data },
    });
  };

  const updateStickerText = (id: string, text: string) => {
    updateNodeMutation.mutate({
      params: { path: { boardId: boardId!, nodeId: id } },
      body: { text },
    });
  };

  const deleteNodes = (ids: string[]) => {
    deleteNodesMutation.mutate({
      params: { path: { boardId: boardId! } },
      body: { ids },
    });
  };

  const updateNodesPositions = (
    positions: { id: string; x: number; y: number }[],
  ) => {
    updatePositionsMutation.mutate({
      params: { path: { boardId: boardId! } },
      body: { positions },
    });
  };

  return {
    nodes,
    addSticker,
    updateStickerText,
    deleteNodes,
    updateNodesPositions,
  };
}

export type NodesModel = ReturnType<typeof useNodes>;
