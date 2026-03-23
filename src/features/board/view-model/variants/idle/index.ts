import { distanceFromPoints } from "../../../domain/point";
import { pointOnScreenToCanvas } from "../../../domain/screen-to-canvas";
import { SelectionType } from "../../../domain/selection";

import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { goToAddSticker } from "../add-sticker";
import { goToSelectionWindow } from "../selection-window";
import { useDeleteSelected } from "./use-delete-selected";
import { useGoToEditSticker } from "./use-go-to-edit-sticker";
import { useSelection } from "./use-selection";

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
  mouseDown?: {
    x: number;
    y: number;
  };
};

export function useIdleViewModel(params: ViewModelParams) {
  const { nodesModel, setViewState, canvasRect } = params;

  const selection = useSelection(params);
  const deleteSelected = useDeleteSelected(params);
  const goToEditSticker = useGoToEditSticker(params);

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: selection.isSelected(idleState, node.id),

      onClick: (e) => {
        const clickResult = goToEditSticker.handleNodeClick(
          idleState,
          node.id,
          e,
        );
        if (clickResult.preventNext) return;

        selection.handleNodeClick(idleState, node.id, e);
      },
    })),
    layout: {
      onKeyDown: (e) => {
        const keyDownResult = goToEditSticker.handleKeyDown(idleState, e);
        if (keyDownResult.preventNext) return;

        deleteSelected.handleKeyDown(idleState, e);

        if (e.key === "s") {
          setViewState(goToAddSticker());
        }
      },
    },
    overlay: {
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
      onMouseUp: () => selection.handleOverlayMouseUp(idleState),
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
                initialSelectedIds: e.shiftKey
                  ? idleState.selectedIds
                  : undefined,
              }),
            );
          }
        }
      },
      onMouseUp: () => {
        setViewState({
          ...idleState,
          mouseDown: undefined,
        });
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

export function goToIdle({
  selectedIds,
}: { selectedIds?: SelectionType } = {}): IdleViewState {
  return {
    type: "idle",
    selectedIds: selectedIds ?? new Set(),
  };
}

export function useGoToAddSticker({ setViewState }: ViewModelParams) {
  const handleNodeClick = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {};
}
