import { distanceFromPoints } from "@/features/board/domain/point";
import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";
import { goToSelectionWindow } from "../selection-window";

export function useGoToSelectionWindow(params: ViewModelParams) {
  const { canvasRect, setViewState } = params;

  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    const { mouseDown } = idleState;
    if (mouseDown?.type !== "overlay") return;

    const currentPoint = pointOnScreenToCanvas(
      { x: e.clientX, y: e.clientY },
      canvasRect,
    );

    if (distanceFromPoints(mouseDown, currentPoint) > 5) {
      setViewState(
        goToSelectionWindow({
          startPoint: mouseDown,
          endPoint: currentPoint,
          initialSelectedIds: e.shiftKey ? idleState.selectedIds : undefined,
        }),
      );
    }
  };

  return { handleWindowMouseMove };
}
