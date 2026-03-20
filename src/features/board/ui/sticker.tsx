import clsx from "clsx";
import { Ref } from "react";

export function Sticker({
  id,
  text,
  x,
  y,
  ref,
  selected,
  onClick,
}: {
  id: string;
  text: string;
  x: number;
  y: number;
  ref: Ref<HTMLButtonElement>;
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      data-id={id}
      ref={ref}
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
