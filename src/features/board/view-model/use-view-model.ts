import { ViewModelParams } from "../types/view-model-params";
import { ViewModel } from "../types/view-model-type";
import { useAddStickerViewModel } from "../variants/add-sticker";
import { useIdleViewModel } from "../variants/idle";

export function useViewModel(params: ViewModelParams) {
  let viewModel: ViewModel;

  const addStickerViewModel = useAddStickerViewModel(params);
  const idleViewModel = useIdleViewModel(params);

  switch (params.viewStateModel.viewState.type) {
    case "add-sticker":
      viewModel = addStickerViewModel();
      break;
    case "idle": {
      viewModel = idleViewModel(params.viewStateModel.viewState);
      break;
    }
    default:
      throw new Error("Invalid view state");
  }

  return viewModel;
}
