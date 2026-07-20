import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Submissions from "./Submissions";
import FormEditor from "./forms/FormEditor";

export default function Forms() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Forms</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage submissions and edit form field labels in English and Arabic.
        </p>
      </div>

      <Tabs defaultValue="submissions" className="w-full">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="contact">Contact form</TabsTrigger>
          <TabsTrigger value="footer_cta">Footer CTA form</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6">
          <Submissions />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <FormEditor formKey="contact_form" title="Contact form (/contact)" />
        </TabsContent>

        <TabsContent value="footer_cta" className="mt-6">
          <FormEditor formKey="footer_cta" title="Footer CTA form (site-wide)" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
