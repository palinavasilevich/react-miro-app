import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";
import type { BoardsSortOption } from "./use-boards-filters";

type BoardsSortSelectProps = {
  value: BoardsSortOption;
  onValueChange: (value: BoardsSortOption) => void;
};

export function BoardsSortSelect({
  value,
  onValueChange,
}: BoardsSortSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onValueChange(value as BoardsSortOption)}
    >
      <SelectTrigger id="sort" className="w-full">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lastOpenedAt">By date opened</SelectItem>
        <SelectItem value="createdAt">By date created</SelectItem>
        <SelectItem value="updatedAt">By date updated</SelectItem>
        <SelectItem value="name">By name</SelectItem>
      </SelectContent>
    </Select>
  );
}
