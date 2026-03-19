import { ScrollArea, ScrollBar } from "@/shared/ui/kit/scroll-area";
import { TemplateCard } from "./template-card";
import { cn } from "@/lib/utils";

export type Template = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
};

const templates: Template[] = [
  {
    id: "1",
    name: "Template 1",
    description: "Template 1 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "2",
    name: "Template 2",
    description: "Template 2 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "3",
    name: "Template 3",
    description: "Template 3 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "4",
    name: "Template 4",
    description: "Template 4 description",
    thumbnail: "https://placehold.co/150",
  },

  {
    id: "5",
    name: "Template 1",
    description: "Template 1 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "6",
    name: "Template 2",
    description: "Template 2 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "7",
    name: "Template 3",
    description: "Template 3 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "8",
    name: "Template 4",
    description: "Template 4 description",
    thumbnail: "https://placehold.co/150",
  },

  {
    id: "9",
    name: "Template 3",
    description: "Template 3 description",
    thumbnail: "https://placehold.co/150",
  },
  {
    id: "10",
    name: "Template 4",
    description: "Template 4 description",
    thumbnail: "https://placehold.co/150",
  },
];

type TemplatesGalleryProps = {
  variant?: "grid" | "list";
  className?: string;
  onSelect?: (template: Template) => void;
};

export function TemplatesGallery({
  variant = "list",
  onSelect,
  className,
}: TemplatesGalleryProps) {
  const containerStyles = cn(
    "gap-4 p-4",
    variant === "list" && "flex w-max",
    variant === "grid" && "grid grid-cols-2",
  );

  return (
    <ScrollArea className={cn("w-full overflow-hidden", className)}>
      <div className={containerStyles}>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => onSelect?.(template)}
          />
        ))}
      </div>

      {variant === "list" && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  );
}
