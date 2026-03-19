import {
  AddStickerViewState,
  useAddStickerViewModel,
} from "./variants/add-sticker";
import { goToIdle, IdleViewState, useIdleViewModel } from "./variants/idle";
import { ViewModel } from "./view-model-type";
import { ViewModelParams } from "./view-model-params";
import { useState } from "react";
import {
  SelectionWindowViewState,
  useSelectionWindowViewModel,
} from "./variants/selection-window";

export type ViewState =
  | AddStickerViewState
  | IdleViewState
  | SelectionWindowViewState;

export function useViewModel(params: Omit<ViewModelParams, "setViewState">) {
  const [viewState, setViewState] = useState<ViewState>(() => goToIdle());

  const newParams = {
    ...params,
    setViewState,
  };

  const addStickerViewModel = useAddStickerViewModel(newParams);
  const idleViewModel = useIdleViewModel(newParams);
  const selectionWindowViewModel = useSelectionWindowViewModel(newParams);

  let viewModel: ViewModel;
  switch (viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "idle": {
      viewModel = idleViewModel(viewState);
      break;
    }
    case "selection-window": {
      viewModel = selectionWindowViewModel(viewState);
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return viewModel;
}
