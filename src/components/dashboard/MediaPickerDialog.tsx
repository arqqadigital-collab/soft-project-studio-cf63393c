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
      <DialogContent className="max-w-5xl">
        <DialogHeader><DialogTitle>Choose an image</DialogTitle></DialogHeader>
        <MediaGrid
          filterType="image"
          onPick={(m) => { onPick(m); onOpenChange(false); }}
        />
      </DialogContent>
    </Dialog>
  );
}
