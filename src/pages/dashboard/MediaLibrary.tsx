import { MediaGrid } from "@/components/dashboard/MediaGrid";

export default function MediaLibrary() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <p className="text-sm text-muted-foreground">Upload and manage your images and files.</p>
      </div>
      <MediaGrid />
    </div>
  );
}
