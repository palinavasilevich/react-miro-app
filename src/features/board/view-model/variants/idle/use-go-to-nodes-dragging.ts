import { distanceFromPoints } from "@/features/board/domain/point";
import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";
import { goToNodesDragging } from "../nodes-dragging";

export function useGoToNodesDragging({
  canvasRect,
  setViewState,
}: ViewModelParams) {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    const { mouseDown } = idleState;
    if (mouseDown?.type !== "node") return;

    const currentPoint = pointOnScreenToCanvas(
      { x: e.clientX, y: e.clientY },
      canvasRect,
    );

    if (distanceFromPoints(mouseDown, currentPoint) > 5) {
      setViewState(
        goToNodesDragging({
          startPoint: mouseDown,
          endPoint: currentPoint,
          nodesToMove: new Set([...idleState.selectedIds, mouseDown.nodeId]),
        }),
      );
    }
  };

  return {
    handleWindowMouseMove,
  };
}
