import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaGrid, type MediaRow } from "./MediaGrid";

export function MediaPickerDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPick: (m: MediaRow) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader><DialogTitle>Choose an image</DialogTitle></DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">
          <MediaGrid
            filterType="image"
            onPick={(m) => { onPick(m); onOpenChange(false); }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
