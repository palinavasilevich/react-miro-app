import { distanceFromPoints } from "../domain/point";
import { pointOnScreenToCanvas } from "../domain/screen-to-canvas";
import { SelectionModifications, selectItems } from "../domain/selection";
import { ViewModelParams } from "../types/view-model-params";
import { ViewModel } from "../types/view-model-type";
import { goToAddSticker } from "./add-sticker";
import { goToSelectionWindow } from "./selection-window";

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
          const currentPoint = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            canvasRect,
          );

          if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
            setViewState(
              goToSelectionWindow({
                startPoint: idleState.mouseDown,
                endPoint: currentPoint,
              }),
            );
          }
        }
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
