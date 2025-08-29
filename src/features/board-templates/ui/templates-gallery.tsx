import { ScrollArea } from "@/shared/ui/kit/scroll-area";
import { TemplateCard } from "./template-card";

const templates = [
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
];

type TemplatesGalleryProps = {
  className?: string;
};

export function TemplatesGallery({ className }: TemplatesGalleryProps) {
  return (
    <ScrollArea className={className}>
      <div className="flex gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => {}}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
