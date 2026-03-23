import clsx from "clsx";
import { Ref } from "react";

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
        "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md",
        isSelected && "outline-2 outline-blue-500",
      )}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onClick}
    >
      {isEditing ? (
        <input
          value={text}
          className="w-full h-full"
          autoFocus
          onChange={(e) => onTextChange?.(e.target.value)}
        />
      ) : (
        text
      )}
    </button>
  );
}
