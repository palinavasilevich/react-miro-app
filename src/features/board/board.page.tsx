import { Ref } from "react";
import { Button } from "@/shared/ui/kit/button";
import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { Node, useNodes } from "./model/use-nodes";
import { useViewModel } from "./model/use-view-model";
import { useCanvasRect } from "./model/use-canvas-rect";
import { useLayoutFocus } from "./model/use-layout-focus";
import clsx from "clsx";

function BoardPage() {
  const { nodes, addSticker } = useNodes();
  const viewModel = useViewModel();
  const focusLayoutRef = useLayoutFocus();
  const { canvasRef, canvasRect } = useCanvasRect();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (viewModel.viewState.type === "add-sticker") {
      console.log(e.key);
      if (e.key === "Escape") {
        viewModel.goToIdle();
      }
    }
    if (viewModel.viewState.type === "idle") {
      if (e.key === "s") {
        viewModel.goToAddSticker();
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, node: Node) => {
    if (viewModel.viewState.type === "idle") {
      if (e.ctrlKey || e.shiftKey) {
        viewModel.selection([node.id], "toggle");
      } else {
        viewModel.selection([node.id], "replace");
      }
    }
  };

  return (
    <Layout onKeyDown={handleKeyDown} ref={focusLayoutRef}>
      <Dots />
      <Canvas
        ref={canvasRef}
        onClick={(e) => {
          if (viewModel.viewState.type === "add-sticker" && canvasRect) {
            addSticker({
              text: "Default",
              x: e.clientX - canvasRect.x,
              y: e.clientY - canvasRect.y,
            });
            viewModel.goToIdle();
          }
        }}
      >
        {nodes.map((node) => (
          <Sticker
            key={node.id}
            text={node.text}
            x={node.x}
            y={node.y}
            selected={
              viewModel.viewState.type === "idle" &&
              viewModel.viewState.selectedIds.has(node.id)
            }
            onClick={(e) => handleClick(e, node)}
          />
        ))}
      </Canvas>

      <Actions>
        <ActionButton
          isActive={viewModel.viewState.type === "add-sticker"}
          onClick={() => {
            if (viewModel.viewState.type === "add-sticker") {
              viewModel.goToIdle();
            } else {
              viewModel.goToAddSticker();
            }
          }}
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

function Layout({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="grow relative" tabIndex={0} ref={ref} {...props}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
  );
}

function Canvas({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div ref={ref} {...props} className="absolute inset-0">
      {children}
    </div>
  );
}

function Sticker({
  text,
  x,
  y,
  selected,
  onClick,
}: {
  text: string;
  x: number;
  y: number;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      className={clsx(
        "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md",
        selected && "outline-2 outline-blue-500",
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow">
      {children}
    </div>
  );
}

function ActionButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={
        isActive
          ? "bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600"
          : ""
      }
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
