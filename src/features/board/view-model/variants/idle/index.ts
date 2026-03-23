import { distanceFromPoints } from "../../../domain/point";
import { pointOnScreenToCanvas } from "../../../domain/screen-to-canvas";
import { SelectionType, selectItems } from "../../../domain/selection";

import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { goToAddSticker } from "../add-sticker";
import { goToEditSticker } from "../edit-sticker";
import { goToSelectionWindow } from "../selection-window";
import { useDeleteSelected } from "./use-delete-selected";
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

  return (idleState: IdleViewState): ViewModel => ({
    nodes: nodesModel.nodes.map((node) => ({
      ...node,
      isSelected: idleState.selectedIds.has(node.id),

      onClick: (e) => {
        if (
          idleState.selectedIds.size === 1 &&
          idleState.selectedIds.has(node.id) &&
          !e.ctrlKey &&
          !e.shiftKey
        ) {
          setViewState(goToEditSticker(node.id));
          return;
        }

        selection.handleNodeClick(idleState, node.id, e);
      },
    })),
    layout: {
      onKeyDown: (e) => {
        if (
          !e.shiftKey &&
          !e.ctrlKey &&
          !e.altKey &&
          !e.metaKey &&
          idleState.selectedIds.size === 1
        ) {
          const [id] = idleState.selectedIds.values();
          setViewState(goToEditSticker(id));
          return;
        }

        if (e.key === "s") {
          setViewState(goToAddSticker());
        }

        deleteSelected.handleKeyDown(idleState, e);
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
      onMouseUp: () => {
        if (idleState.mouseDown) {
          setViewState({
            ...idleState,
            selectedIds: selectItems(idleState.selectedIds, [], "replace"),
          });
        }
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
