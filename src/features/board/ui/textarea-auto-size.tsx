import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

export function TextareaAutoSize({
  value,
  isEditing,
  onChange,
}: {
  value: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const { scrollWidth, clientHeight } = ref.current;
    setHeight(clientHeight);
    setWidth(scrollWidth);
  }, [value]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className={clsx("whitespace-pre-wrap ", isEditing && "opacity-0")}
      >
        {value}
      </div>
      {isEditing && (
        <textarea
          className="absolute left-0 top-0 resize-none overflow-hidden focus:outline-none"
          value={value}
          autoFocus
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: width + 3,
            height: height + 3,
          }}
        />
      )}
    </div>
  );
}
