import { Dispatch, SetStateAction } from "react";
import { NodesModel } from "../model/use-nodes";
import { CanvasRect } from "../hooks/use-canvas-rect";
import { ViewState } from "../view-model/use-view-model";

export type ViewModelParams = {
  setViewState: Dispatch<SetStateAction<ViewState>>;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
};
