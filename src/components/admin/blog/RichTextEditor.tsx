"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";

/**
 * The article body editor. It edits the same tags the backend allows (headings 2 to 4, lists, bold, italic,
 * quotes, rules, links, tables); anything else is removed by the backend when the post is saved.
 */
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
			Link.configure({ openOnClick: false, autolink: false, protocols: ["http", "https", "mailto"] }),
			Table,
			TableRow,
			TableHeader,
			TableCell,
		],
		content: value,
		immediatelyRender: false,
		editorProps: { attributes: { class: "min-h-64 rounded-b-md border border-t-0 px-3 py-2 text-base leading-7 outline-none [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:font-semibold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-6 [&_ol]:ml-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_a]:text-primary [&_a]:underline [&_td]:border [&_th]:border [&_td]:p-1 [&_th]:p-1 [&_table]:w-full" } },
		onUpdate: ({ editor: current }) => onChange(current.isEmpty ? "" : current.getHTML()),
	});

	if (!editor) return <div className="min-h-64 rounded-md border" />;

	const button = (label: string, active: boolean, run: () => void) => (
		<Button key={label} type="button" size="sm" variant={active ? "default" : "outline"} onClick={run} aria-pressed={active}>
			{label}
		</Button>
	);

	const setLink = () => {
		const previous = editor.getAttributes("link").href as string | undefined;
		const url = window.prompt("Link address (https://...)", previous ?? "https://");
		if (url === null) return;
		if (url.trim() === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
		else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
	};

	return (
		<div>
			<div className="flex flex-wrap gap-1 rounded-t-md border bg-muted/50 p-2" role="toolbar" aria-label="Formatting">
				{button("Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
				{button("Italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
				{button("H2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
				{button("H3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
				{button("H4", editor.isActive("heading", { level: 4 }), () => editor.chain().focus().toggleHeading({ level: 4 }).run())}
				{button("List", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
				{button("Numbered", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
				{button("Quote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
				{button("Rule", false, () => editor.chain().focus().setHorizontalRule().run())}
				{button("Link", editor.isActive("link"), setLink)}
				{button("Table", editor.isActive("table"), () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
				{button("Undo", false, () => editor.chain().focus().undo().run())}
				{button("Redo", false, () => editor.chain().focus().redo().run())}
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}
