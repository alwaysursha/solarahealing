"use client";

import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-text-style/font-size";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState, useTransition } from "react";
import { MEDIA_ALLOWED_TYPES, MEDIA_MAX_BYTES } from "@/lib/media-limits";

type ArticleBodyEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

/** Matches `.article-prose` body color on the storefront. */
export const ARTICLE_BODY_BASE_COLOR = "rgba(58, 37, 96, 0.78)";

const FONT_SIZES = [
  { label: "Body", value: "" },
  { label: "Small", value: "0.9rem" },
  { label: "Large", value: "1.25rem" },
  { label: "Subtitle", value: "1.35rem" },
  { label: "Title", value: "1.7rem" },
] as const;

const TEXT_COLORS = [
  { label: "Body (site)", value: "" },
  { label: "Deep purple", value: "#5c1470" },
  { label: "Soft purple", value: "#8f63b5" },
  { label: "Orchid", value: "#b84dc8" },
  { label: "Gold", value: "#c9a227" },
  { label: "Muted", value: "rgba(58, 37, 96, 0.55)" },
  { label: "Ink", value: "#2a1838" },
] as const;

type ToolbarButtonProps = {
  label: string;
  title?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({ label, title, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title ?? label}
      aria-label={title ?? label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={[
        "article-body-toolbar-btn",
        active ? "is-active" : "",
        disabled ? "is-disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="article-body-toolbar-divider" aria-hidden />;
}

async function compressImage(file: File, maxWidth: number): Promise<File> {
  if (!file.type.startsWith("image/") || typeof createImageBitmap === "undefined") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.82),
  );
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}

export function ArticleBodyEditor({
  value,
  onChange,
  placeholder = "Write the full article…",
}: ArticleBodyEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [, setSelectionTick] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        horizontalRule: {},
      }),
      TextStyle,
      FontSize,
      Color,
      Underline,
      Highlight.configure({ multicolor: false }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "article-prose-image",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      TextAlign.configure({ types: ["paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: {
      attributes: {
        class: "article-prose article-body-editor-surface focus:outline-none",
        style: `color: ${ARTICLE_BODY_BASE_COLOR}`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    const bump = () => setSelectionTick((tick) => tick + 1);
    editor.on("selectionUpdate", bump);
    editor.on("transaction", bump);
    return () => {
      editor.off("selectionUpdate", bump);
      editor.off("transaction", bump);
    };
  }, [editor]);

  if (!editor) {
    return <div className="article-body-editor-loading" aria-hidden />;
  }

  const currentFontSize = (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";
  const currentColor = (editor.getAttributes("textStyle").color as string | undefined) ?? "";

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const onFontSizeChange = (next: string) => {
    if (!next) {
      editor.chain().focus().unsetFontSize().run();
      return;
    }
    editor.chain().focus().setFontSize(next).run();
  };

  const onColorChange = (next: string) => {
    if (!next) {
      editor.chain().focus().unsetColor().run();
      return;
    }
    editor.chain().focus().setColor(next).run();
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);

    startUpload(async () => {
      try {
        if (!MEDIA_ALLOWED_TYPES.has(file.type)) {
          throw new Error("Only JPEG, PNG, and WebP images are allowed.");
        }

        let prepared = await compressImage(file, 1400);
        if (prepared.size > MEDIA_MAX_BYTES) {
          prepared = await compressImage(file, 1050);
        }
        if (prepared.size > MEDIA_MAX_BYTES) {
          throw new Error("Image must be 2 MB or smaller after compression.");
        }

        const body = new FormData();
        body.set("file", prepared);
        body.set("folder", "general");
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const payload = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !payload.url) {
          throw new Error(payload.error || "Upload failed");
        }

        editor.chain().focus().setImage({ src: payload.url }).run();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  return (
    <div className="article-body-editor">
      <div className="article-body-editor-chrome">
        <div className="article-body-mode-tabs" role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "write"}
            className={["article-body-mode-tab", mode === "write" ? "is-active" : ""].join(" ")}
            onClick={() => setMode("write")}
          >
            Write
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "preview"}
            className={["article-body-mode-tab", mode === "preview" ? "is-active" : ""].join(" ")}
            onClick={() => setMode("preview")}
          >
            Live preview
          </button>
        </div>

        {mode === "write" ? (
          <>
            <div className="article-body-toolbar" role="toolbar" aria-label="Formatting">
              <label className="article-body-toolbar-select-wrap">
                <span className="article-body-visually-hidden">Font size</span>
                <select
                  className="article-body-toolbar-select"
                  value={currentFontSize}
                  onChange={(event) => onFontSizeChange(event.target.value)}
                  title="Font size"
                >
                  {FONT_SIZES.map((size) => (
                    <option key={size.label} value={size.value}>
                      {size.label}
                      {size.value ? ` (${size.value})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="article-body-toolbar-select-wrap article-body-color-select-wrap">
                <span className="article-body-visually-hidden">Text color</span>
                <span
                  className="article-body-color-swatch"
                  style={{ background: currentColor || ARTICLE_BODY_BASE_COLOR }}
                  aria-hidden
                />
                <select
                  className="article-body-toolbar-select article-body-color-select"
                  value={currentColor}
                  onChange={(event) => onColorChange(event.target.value)}
                  title="Text color"
                >
                  {TEXT_COLORS.map((color) => (
                    <option key={color.label} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </label>

              <ToolbarDivider />
              <ToolbarButton
                label="B"
                title="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
              <ToolbarButton
                label="I"
                title="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
              <ToolbarButton
                label="U"
                title="Underline"
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
              <ToolbarButton
                label="S"
                title="Strikethrough"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              />
              <ToolbarButton
                label="Mark"
                title="Highlight"
                active={editor.isActive("highlight")}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
              />
              <ToolbarDivider />
              <ToolbarButton
                label="• List"
                title="Bullet list"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
              <ToolbarButton
                label="1. List"
                title="Numbered list"
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
              <ToolbarButton
                label="Quote"
                title="Blockquote"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              />
              <ToolbarButton
                label="—"
                title="Horizontal rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              />
              <ToolbarDivider />
              <ToolbarButton
                label="Link"
                title="Insert or edit link"
                active={editor.isActive("link")}
                onClick={setLink}
              />
              <ToolbarButton
                label={uploading ? "Uploading…" : "Upload image"}
                title="Upload and insert image"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => onFile(event.target.files?.[0])}
              />
              <ToolbarDivider />
              <ToolbarButton
                label="⟸"
                title="Align left"
                active={editor.isActive({ textAlign: "left" })}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
              />
              <ToolbarButton
                label="≡"
                title="Align center"
                active={editor.isActive({ textAlign: "center" })}
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
              />
              <ToolbarButton
                label="⟹"
                title="Align right"
                active={editor.isActive({ textAlign: "right" })}
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
              />
              <ToolbarDivider />
              <ToolbarButton
                label="Undo"
                title="Undo"
                disabled={!editor.can().undo()}
                onClick={() => editor.chain().focus().undo().run()}
              />
              <ToolbarButton
                label="Redo"
                title="Redo"
                disabled={!editor.can().redo()}
                onClick={() => editor.chain().focus().redo().run()}
              />
              <ToolbarButton
                label="Clear"
                title="Clear formatting"
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              />
            </div>
            {uploadError ? <p className="article-body-upload-error">{uploadError}</p> : null}
          </>
        ) : (
          <p className="article-body-preview-hint">
            Exact storefront article styling — what readers see on `/articles/[slug]`.
          </p>
        )}
      </div>

      <div className="article-body-editor-stage">
        {mode === "write" ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className="article-prose article-body-preview-pane"
            style={{ color: ARTICLE_BODY_BASE_COLOR }}
            dangerouslySetInnerHTML={{ __html: value || "<p></p>" }}
          />
        )}
      </div>
    </div>
  );
}
