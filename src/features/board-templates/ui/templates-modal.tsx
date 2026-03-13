import { useTemplatesModal } from "../modal/use-templates-modal";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/kit/dialog";
import { Template, TemplatesGallery } from "./templates-gallery";

export function TemplatesModal() {
  const { isOpen, close } = useTemplatesModal();

  const handleSelect = (template: Template) => {
    console.log("Selected template", template);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select template</DialogTitle>
          <DialogDescription>
            Select a template to create a new board
          </DialogDescription>
        </DialogHeader>

        <TemplatesGallery
          onSelect={handleSelect}
          variant={"grid"}
          className="h-[60vh] pr-4"
        />
      </DialogContent>
    </Dialog>
  );
}
