import { ViewStateModel } from "../model/use-view-state";
import { NodesModel } from "../model/use-nodes";
import { CanvasRect } from "../hooks/use-canvas-rect";

export type ViewModelParams = {
  viewStateModel: ViewStateModel;
  nodesModel: NodesModel;
  canvasRect: CanvasRect | undefined;
};
