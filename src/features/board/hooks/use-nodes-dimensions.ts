import { useCallback, useState, RefCallback, useRef, useEffect } from "react";

export type NodeDimensions = {
  width: number;
  height: number;
};

export type NodesDimensionsMap = Record<string, NodeDimensions>;

export const useNodesDimensions = () => {
  const [nodesDimensions, setNodesDimensions] = useState({});

  const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

  const nodeRef: RefCallback<Element> = useCallback((el) => {
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const nodesToUpdate = Object.fromEntries(
          entries
            .map((entry) => [
              (entry.target as HTMLElement).dataset.id,
              {
                width: entry.contentRect.width,
                height: entry.contentRect.height,
              },
            ])
            .filter((entry) => !!entry[0]),
        );

        setNodesDimensions((prev) => ({
          ...prev,
          ...nodesToUpdate,
        }));
      });
    }

    const resizeObserver = resizeObserverRef.current;

    if (el) {
      resizeObserver.observe(el);

      return () => {
        resizeObserver.unobserve(el);
      };
    }
  }, []);

  useEffect(
    () => () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    },
    [],
  );

  console.log(nodesDimensions);

  return { nodeRef, nodesDimensions };
};
