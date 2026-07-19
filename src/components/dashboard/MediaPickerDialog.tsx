import { useEffect } from "react";
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
  // Restore body scroll/pointer-events if a parent dialog's scroll-lock
  // gets left behind after this nested dialog closes.
  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => {
      const anyOpen = document.querySelector('[data-state="open"][role="dialog"]');
      if (!anyOpen) {
        document.body.style.pointerEvents = "";
        document.body.style.overflow = "";
      } else {
        // Parent dialog still open — make sure it can scroll/interact.
        document.body.style.pointerEvents = "";
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Choose an image</DialogTitle>
        </DialogHeader>
        <div
          className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6 overscroll-contain"
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
        >
          <MediaGrid
            filterType="image"
            onPick={(m) => {
              onPick(m);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
