import { useEffect, useRef, useState } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Live iframe preview of the homepage, scrolled to the given anchor.
 * `reloadKey` bumps a counter to force a refresh (e.g. after save).
 */
export function SectionPreview({
  anchor,
  reloadKey = 0,
  title = "Live preview",
}: {
  anchor?: string;
  reloadKey?: number;
  title?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [tick, setTick] = useState(0);
  const src = `/?preview=1&_r=${reloadKey}-${tick}${anchor ? `#${anchor}` : ""}`;
  const openSrc = `/?preview=1${anchor ? `#${anchor}` : ""}`;

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    el.src = src;
  }, [src]);


  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setTick((t) => t + 1)} title="Refresh preview">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild variant="ghost" size="sm" title="Open in new tab">
            <a href={openSrc} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-hidden bg-muted" style={{ height: 520 }}>
          <iframe
            ref={iframeRef}
            src={src}
            title={title}
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
        <p className="border-t px-3 py-2 text-[11px] text-muted-foreground">
          Preview reflects the last saved version. Click Save to see your changes here.
        </p>
      </CardContent>
    </Card>
  );
}
