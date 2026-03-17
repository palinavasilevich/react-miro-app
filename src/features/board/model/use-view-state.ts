import { useState } from "react";

export type AddStickerViewState = {
  type: "add-sticker";
};

export type IdleViewState = {
  type: "idle";
  selectedIds: Set<string>;
};

type ViewState = AddStickerViewState | IdleViewState;

export function useViewState() {
  const [viewState, setViewState] = useState<ViewState>({
    type: "idle",
    selectedIds: new Set(),
  });

  const goToIdle = () =>
    setViewState({
      type: "idle",
      selectedIds: new Set(),
    });

  const goToAddSticker = () =>
    setViewState({
      type: "add-sticker",
    });

  const selection = (
    ids: string[],
    modification: "replace" | "add" | "toggle" = "replace",
  ) => {
    setViewState((state) => {
      if (state.type === "idle") {
        return selectItems(state, ids, modification);
      }

      return state;
    });
  };

  return { viewState, selection, goToIdle, goToAddSticker };
}

export type ViewStateModel = ReturnType<typeof useViewState>;

function selectItems(
  viewState: IdleViewState,
  ids: string[],
  modification: "replace" | "add" | "toggle" = "replace",
) {
  if (modification === "replace") {
    return {
      ...viewState,
      selectedIds: new Set(ids),
    };
  }

  if (modification === "add") {
    return {
      ...viewState,
      selectedIds: new Set([...viewState.selectedIds, ...ids]),
    };
  }

  if (modification === "toggle") {
    const currentIds = new Set(viewState.selectedIds);
    const newIds = new Set(ids);

    const base = Array.from(viewState.selectedIds).filter(
      (id) => !newIds.has(id),
    );
    const added = ids.filter((id) => !currentIds.has(id));

    return {
      ...viewState,
      selectedIds: new Set([...base, ...added]),
    };
  }

  return viewState;
}
