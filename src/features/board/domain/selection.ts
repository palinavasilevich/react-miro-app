export type SelectionModifications = "replace" | "add" | "toggle";
export type SelectionType = Set<string>;

export function selectItems(
  initialSelected: SelectionType,
  ids: string[],
  modification: SelectionModifications,
): SelectionType {
  if (modification === "replace") {
    return new Set(ids);
  }

  if (modification === "add") {
    return new Set([...initialSelected, ...ids]);
  }

  if (modification === "toggle") {
    const currentIds = new Set(initialSelected);
    const newIds = new Set(ids);

    const base = Array.from(initialSelected).filter((id) => !newIds.has(id));
    const added = ids.filter((id) => !currentIds.has(id));

    return new Set([...base, ...added]);
  }

  return initialSelected;
}
