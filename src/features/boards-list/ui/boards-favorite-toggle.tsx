import { Button } from "@/shared/ui/kit/button";
import { StarIcon } from "lucide-react";
import { cn } from "@/shared/lib/css";

type BoardsFavoriteToggleProps = {
  isFavorite: boolean;
  className?: string;
  onToggle: () => void;
};

export function BoardsFavoriteToggle({
  isFavorite,
  className,
  onToggle,
}: BoardsFavoriteToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className={cn(
        "text-gray-500 cursor-pointer hover:bg-transparent transition-colors",
        className,
      )}
    >
      <StarIcon
        className={cn(
          "w-5 h-5",
          isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400",
        )}
      />
    </Button>
  );
}
