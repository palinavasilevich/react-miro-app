import { Ref } from "react";
import clsx from "clsx";
import { TextareaAutoSize } from "./textarea-auto-size";

export function Sticker({
  id,
  text,
  x,
  y,
  ref,
  isSelected,
  isEditing,
  onClick,
  onTextChange,
}: {
  id: string;
  text: string;
  x: number;
  y: number;
  ref: Ref<HTMLButtonElement>;
  isSelected?: boolean;
  isEditing?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onTextChange?: (text: string) => void;
}) {
  return (
    <button
      data-id={id}
      ref={ref}
      className={clsx(
        "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md text-left",
        isSelected && "outline-2 outline-blue-500",
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      <TextareaAutoSize
        isEditing={isEditing ?? false}
        value={text}
        onChange={(value) => onTextChange?.(value)}
      />
    </button>
  );
}
