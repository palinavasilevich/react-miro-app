import { useNodes } from "./model/nodes";
import { useCanvasRect } from "./hooks/use-canvas-rect";
import { useLayoutFocus } from "./hooks/use-layout-focus";
import { useViewModel } from "./view-model/use-view-model";
import { useWindowEvents } from "./hooks/use-window-events";
import {
  ActionButton,
  Actions,
  Canvas,
  Dots,
  Layout,
  Overlay,
  SelectionWindow,
  Sticker,
} from "./ui";

import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodesDimensions } from "./hooks/use-nodes-dimensions";

function BoardPage() {
  const nodesModel = useNodes();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRect();
  const { nodeRef, nodesDimensions } = useNodesDimensions();

  const viewModel = useViewModel({ nodesModel, canvasRect, nodesDimensions });

  useWindowEvents(viewModel);

  return (
    <Layout ref={focusLayoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
      <Dots />
      <Canvas ref={canvasRef} onClick={viewModel.canvas?.onClick}>
        <Overlay
          onClick={viewModel.overlay?.onClick}
          onMouseDown={viewModel.overlay?.onMouseDown}
          onMouseUp={viewModel.overlay?.onMouseUp}
        />

        {viewModel.nodes.map((node) => (
          <Sticker key={node.id} {...node} ref={nodeRef} />
        ))}
      </Canvas>
      {viewModel.selectionWindow && (
        <SelectionWindow {...viewModel.selectionWindow} />
      )}
      <Actions>
        <ActionButton
          isActive={viewModel.actions?.addSticker?.isActive}
          onClick={viewModel.actions?.addSticker?.onClick}
        >
          <StickerIcon />
        </ActionButton>

        <ActionButton isActive={false} onClick={() => {}}>
          <ArrowRightIcon />
        </ActionButton>
      </Actions>
    </Layout>
  );
}

export const Component = BoardPage;
