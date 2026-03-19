import { Point } from "../domain/point";
import { createRectFromPoints } from "../domain/rect";
import { pointOnScreenToCanvas } from "../domain/screen-to-canvas";
import { ViewModelParams } from "../types/view-model-params";
import { ViewModel } from "../types/view-model-type";
import { goToIdle } from "./idle";

export type SelectionWindowViewState = {
  type: "selection-window";
  startPoint: Point;
  endPoint: Point;
  initialSelectedIds: Set<string>;
};

export function useSelectionWindowViewModel({
  nodesModel,
  canvasRect,
  setViewState,
}: ViewModelParams) {
  return (state: SelectionWindowViewState): ViewModel => {
    const rect = createRectFromPoints(state.startPoint, state.endPoint);

    return {
      selectionWindow: rect,
      nodes: nodesModel.nodes,
      window: {
        onMouseMove: (e) => {
          const currentPoint = pointOnScreenToCanvas(
            {
              x: e.clientX,
              y: e.clientY,
            },
            canvasRect,
          );

          setViewState({ ...state, endPoint: currentPoint });
        },
        onMouseUp: () => {
          setViewState(goToIdle());
        },
      },
    };
  };
}

export function goToSelectionWindow({
  startPoint,
  endPoint,
  initialSelectedIds,
}: {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  initialSelectedIds?: Set<string>;
}): SelectionWindowViewState {
  return {
    type: "selection-window",
    startPoint,
    endPoint,
    initialSelectedIds: initialSelectedIds ?? new Set(),
  };
}
