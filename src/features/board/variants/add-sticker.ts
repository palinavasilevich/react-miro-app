import { ViewModelParams } from "../types/view-model-params";
import { ViewModel } from "../types/view-model-type";
import { goToIdle } from "./idle";

export type AddStickerViewState = {
  type: "add-sticker";
};

export function useAddStickerViewModel({
  nodesModel,
  canvasRect,
  setViewState,
}: ViewModelParams) {
  return (): ViewModel => ({
    nodes: nodesModel.nodes,
    layout: {
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          setViewState(goToIdle());
        }
      },
    },
    canvas: {
      onClick: (e) => {
        if (!canvasRect) return;
        nodesModel.addSticker({
          text: "Default",
          x: e.clientX - canvasRect.x,
          y: e.clientY - canvasRect.y,
        });
        setViewState(goToIdle());
      },
    },
    actions: {
      addSticker: {
        isActive: true,
        onClick: () => setViewState(goToIdle()),
      },
    },
  });
}

export function goToAddSticker(): AddStickerViewState {
  return {
    type: "add-sticker",
  };
}
