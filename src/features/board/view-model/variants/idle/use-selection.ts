import {
  SelectionModifications,
  selectItems,
} from "@/features/board/domain/selection";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";

export function useSelection({ setViewState }: ViewModelParams) {
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

  const isSelected = (idleState: IdleViewState, nodeId: string) => {
    return idleState.selectedIds.has(nodeId);
  };

  const handleNodeClick = (
    idleState: IdleViewState,
    nodeId: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (e.ctrlKey || e.shiftKey) {
      select(idleState, [nodeId], "toggle");
    } else {
      select(idleState, [nodeId], "replace");
    }
  };

  const handleOverlayMouseUp = (idleState: IdleViewState) => {
    if (idleState.mouseDown) {
      setViewState({
        ...idleState,
        selectedIds: selectItems(idleState.selectedIds, [], "replace"),
      });
    }
  };

  const handleEscapeKey = (
    idleState: IdleViewState,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e.key === "Escape" && idleState.selectedIds.size > 0) {
      setViewState({
        ...idleState,
        selectedIds: selectItems(idleState.selectedIds, [], "replace"),
      });
    }
  };

  return { isSelected, handleNodeClick, handleOverlayMouseUp, handleEscapeKey };
}
