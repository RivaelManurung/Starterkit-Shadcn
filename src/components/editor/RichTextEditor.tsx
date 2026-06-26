"use client"

import React, { useEffect, useRef, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  storageKey?: string
}

const ToolbarButton = ({
  active,
  onClick,
  disabled,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  title: string
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
        active && "bg-accent text-accent-foreground font-semibold border border-border"
      )}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten Anda di sini...",
  storageKey,
}: RichTextEditorProps) {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved")
  const lastSavedContent = useRef(value)
  const isFirstMount = useRef(true)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  // Sync external changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false })
      lastSavedContent.current = value
    }
  }, [value, editor])

  // Check for saved draft in localStorage on mount
  useEffect(() => {
    if (!editor || !storageKey || !isFirstMount.current) return

    isFirstMount.current = false
    const saved = localStorage.getItem(storageKey)
    
    // If we have saved content, and it is different from the initial value
    if (saved && saved !== value && saved !== "<p></p>") {
      toast("Draf tidak tersimpan ditemukan untuk artikel ini.", {
        action: {
          label: "Pulihkan",
          onClick: () => {
            editor.commands.setContent(saved)
            onChange(saved)
            lastSavedContent.current = saved
            toast.success("Draf berhasil dipulihkan.")
          },
        },
        duration: 10000,
      })
    }
  }, [editor, storageKey, value, onChange])

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!editor || !storageKey) return

    const interval = setInterval(() => {
      const currentContent = editor.getHTML()
      
      // Save if it differs from the last saved state and is not empty
      if (currentContent !== lastSavedContent.current && currentContent !== "<p></p>") {
        setSaveStatus("saving")
        localStorage.setItem(storageKey, currentContent)
        lastSavedContent.current = currentContent
        
        // Visual feedback delay
        setTimeout(() => {
          setSaveStatus("saved")
        }, 800)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [editor, storageKey])

  if (!editor) {
    return (
      <div className="border border-input rounded-md h-[450px] bg-background animate-pulse flex flex-col">
        <div className="h-[45px] bg-muted/40 border-b border-border" />
        <div className="flex-1 p-4" />
        <div className="h-[36px] bg-muted/20 border-t border-border" />
      </div>
    )
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Masukkan URL Link:", previousUrl || "")

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt("Masukkan URL Gambar:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background flex flex-col focus-within:ring-1 focus-within:ring-ring">
      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
          padding: 1rem;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--color-muted-foreground);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h1 { font-size: 2.25rem; font-weight: 800; line-height: 2.5rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .ProseMirror h2 { font-size: 1.875rem; font-weight: 700; line-height: 2.25rem; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .ProseMirror h3 { font-size: 1.5rem; font-weight: 600; line-height: 2rem; margin-top: 1rem; margin-bottom: 0.5rem; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ProseMirror blockquote { border-left: 4px solid var(--color-border); padding-left: 1rem; font-style: italic; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ProseMirror pre { background-color: var(--color-muted); padding: 0.75rem 1rem; border-radius: 0.375rem; font-family: monospace; overflow-x: auto; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .ProseMirror code { background-color: var(--color-muted); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875em; }
        .ProseMirror pre code { background-color: transparent; padding: 0; border-radius: 0; }
        .ProseMirror a { color: var(--color-primary); text-decoration: underline; cursor: pointer; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.375rem; display: block; margin: 1rem 0; }
        .ProseMirror hr { border: 0; border-top: 1px solid var(--color-border); margin: 1.5rem 0; }
      `}</style>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted/40 border-b border-border items-center">
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <ToolbarButton
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <ToolbarButton
          title="Insert Link"
          onClick={setLink}
          active={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Insert Image"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <div className="h-4 w-[1px] bg-border mx-1 flex-grow" />

        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />

      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-muted/20 border-t border-border text-xs text-muted-foreground select-none">
        <div>
          {storageKey && saveStatus === "saving" && (
            <span className="flex items-center gap-1.5 text-amber-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Menyimpan...
            </span>
          )}
          {storageKey && saveStatus === "saved" && (
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Tersimpan
            </span>
          )}
        </div>
        <div>
          <span>
            {editor.storage.characterCount.characters()} karakter (
            {editor.storage.characterCount.words()} kata)
          </span>
        </div>
      </div>
    </div>
  )
}
