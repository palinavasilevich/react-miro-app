import { pointOnScreenToCanvas } from "../domain/screen-to-canvas";
import { SelectionModifications, selectItems } from "../domain/selection";
import { ViewModelParams } from "../types/view-model-params";
import { ViewModel } from "../types/view-model-type";
import { goToAddSticker } from "./add-sticker";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

export function useIdleViewModel({
  nodesModel,
  canvasRect,
  setViewState,
}: ViewModelParams) {
  const select = (
    lastState: IdleViewState,
    ids: string[],
    modification: SelectionModifications,
  ) => {
    setViewState({
      ...lastState,
      selectedIds: selectItems(lastState.selectedIds, ids, modification),
    });
  };

  return (idleState: IdleViewState): ViewModel => ({
    selectionWindow: {
      x: 100,
      y: 100,
      width: 1000,
      height: 100,
    },
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: idleState.selectedIds.has(node.id),
      onClick: (e) => {
        if (e.ctrlKey || e.shiftKey) {
          select(idleState, [node.id], "toggle");
        } else {
          select(idleState, [node.id], "replace");
        }
      },
    })),
    layout: {
      onKeyDown: (e) => {
        if (e.key === "s") {
          setViewState(goToAddSticker());
        }
      },
    },
    overlay: {
      onClick: () => {
        select(idleState, [], "replace");
      },
      onMouseDown: (e) => {
        if (!canvasRect) return;

        setViewState({
          ...idleState,
          mouseDown: pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            canvasRect,
          ),
        });
      },
    },
    window: {
      onMouseMove: (e) => {
        if (idleState.mouseDown) {
          console.log(idleState);
        }
        // console.log("onMouseMove", e);
      },
      onMouseUp: (e) => {
        console.log("onMouseUp", e);
      },
    },
    actions: {
      addSticker: {
        isActive: false,
        onClick: () => {
          setViewState(goToAddSticker());
        },
      },
    },
  });
}

export function goToIdle(): IdleViewState {
  return {
    type: "idle",
    selectedIds: new Set(),
  };
}
