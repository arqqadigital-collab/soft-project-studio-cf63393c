import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold, Italic, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo, Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MediaPickerDialog } from "./MediaPickerDialog";

function ToolbarButton({
  onClick, active, children, title,
}: {
  onClick: () => void; active?: boolean; children: React.ReactNode; title: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", active && "bg-muted text-foreground")}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );
}

function HeadingSelect({ editor }: { editor: Editor }) {
  const current =
    editor.isActive("heading", { level: 1 }) ? "1" :
    editor.isActive("heading", { level: 2 }) ? "2" :
    editor.isActive("heading", { level: 3 }) ? "3" :
    editor.isActive("heading", { level: 4 }) ? "4" :
    editor.isActive("heading", { level: 5 }) ? "5" :
    editor.isActive("heading", { level: 6 }) ? "6" :
    "p";

  return (
    <Select
      value={current}
      onValueChange={(v) => {
        if (v === "p") editor.chain().focus().setParagraph().run();
        else editor.chain().focus().toggleHeading({ level: Number(v) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
      }}
    >
      <SelectTrigger className="h-8 w-[130px]" title="Text style">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="p">Paragraph</SelectItem>
        <SelectItem value="1"><span className="text-2xl font-bold">Heading 1</span></SelectItem>
        <SelectItem value="2"><span className="text-xl font-bold">Heading 2</span></SelectItem>
        <SelectItem value="3"><span className="text-lg font-semibold">Heading 3</span></SelectItem>
        <SelectItem value="4"><span className="text-base font-semibold">Heading 4</span></SelectItem>
        <SelectItem value="5"><span className="text-sm font-semibold">Heading 5</span></SelectItem>
        <SelectItem value="6"><span className="text-xs font-semibold uppercase">Heading 6</span></SelectItem>
      </SelectContent>
    </Select>
  );
}

function Toolbar({ editor, onPickImage }: { editor: Editor; onPickImage: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-1">
      <HeadingSelect editor={editor} />
      <div className="mx-1 h-6 w-px bg-border" />
      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Link" active={editor.isActive("link")} onClick={() => {
        const prev = editor.getAttributes("link").href as string | undefined;
        const url = window.prompt("URL", prev ?? "https://");
        if (url === null) return;
        if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
        else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }}><LinkIcon className="h-4 w-4" /></ToolbarButton>
      <ToolbarButton title="Insert image" onClick={onPickImage}><ImageIcon className="h-4 w-4" /></ToolbarButton>
      <div className="ml-auto flex items-center gap-1">
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></ToolbarButton>
      </div>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-4 dark:prose-invert",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-md border border-input bg-background">
      <Toolbar editor={editor} onPickImage={() => setPickerOpen(true)} />
      <EditorContent editor={editor} />
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => {
          if (m.file_url) editor.chain().focus().setImage({ src: m.file_url, alt: m.alt_text ?? "" }).run();
        }}
      />
    </div>
  );
}
