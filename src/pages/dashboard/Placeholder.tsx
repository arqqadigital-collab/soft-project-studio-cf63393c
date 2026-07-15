import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming next</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {description ?? "This module ships in an upcoming phase."}
        </CardContent>
      </Card>
    </div>
  );
}
