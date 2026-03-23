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

  return { handleNodeClick };
}
