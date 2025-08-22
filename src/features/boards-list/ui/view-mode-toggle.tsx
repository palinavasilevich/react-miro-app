import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import { ImagesIcon, ListIcon } from "lucide-react";

export type ViewMode = "list" | "grid";

type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <Tabs defaultValue={value} onValueChange={(e) => onChange(e as ViewMode)}>
      <TabsList>
        <TabsTrigger value="list">
          <ListIcon />
        </TabsTrigger>
        <TabsTrigger value="grid">
          <ImagesIcon />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
