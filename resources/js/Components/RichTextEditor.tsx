import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useRef, useState } from 'react';
import axios from 'axios';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    uploadUrl?: string;
}

/**
 * RichTextEditor - TipTap-based rich text editor with image upload
 */
export default function RichTextEditor({ 
    content, 
    onChange, 
    placeholder = 'Tulis konten artikel di sini...',
    uploadUrl = '/admin/editor/upload-image'
}: RichTextEditorProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor || !file) return;
        
        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 2MB');
            return;
        }

        setUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            if (response.data.url && editor && !editor.isDestroyed) {
                editor.commands.setImage({ src: response.data.url });
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            alert('Gagal mengupload gambar: ' + (error.response?.data?.message || error.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    }, [editor, uploadUrl]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    // Handle paste events for images
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    handleImageUpload(file);
                }
                break;
            }
        }
    }, [handleImageUpload]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden" onPaste={handlePaste}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-surface-hover">
                {/* Text Formatting */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Bold"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Italic"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="19" y1="4" x2="10" y2="4" />
                        <line x1="14" y1="20" x2="5" y2="20" />
                        <line x1="15" y1="4" x2="9" y2="20" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Strikethrough"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <path d="M16 6C16 6 14 4 12 4C10 4 8 5 8 7C8 9 10 10 12 10" />
                        <path d="M8 18C8 18 10 20 12 20C14 20 16 19 16 17C16 15 14 14 12 14" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Heading 2"
                >
                    <span className="text-xs font-bold">H2</span>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Heading 3"
                >
                    <span className="text-xs font-bold">H3</span>
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Bullet List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="9" y1="6" x2="20" y2="6" />
                        <line x1="9" y1="12" x2="20" y2="12" />
                        <line x1="9" y1="18" x2="20" y2="18" />
                        <circle cx="4" cy="6" r="1" fill="currentColor" />
                        <circle cx="4" cy="12" r="1" fill="currentColor" />
                        <circle cx="4" cy="18" r="1" fill="currentColor" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Numbered List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="10" y1="6" x2="20" y2="6" />
                        <line x1="10" y1="12" x2="20" y2="12" />
                        <line x1="10" y1="18" x2="20" y2="18" />
                        <text x="2" y="8" className="text-[8px]" fill="currentColor">1</text>
                        <text x="2" y="14" className="text-[8px]" fill="currentColor">2</text>
                        <text x="2" y="20" className="text-[8px]" fill="currentColor">3</text>
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Quote"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .75-1 2.25" />
                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4" />
                    </svg>
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Links & Images */}
                <button
                    type="button"
                    onClick={setLink}
                    className={`p-2 rounded hover:bg-surface transition-colors ${
                        editor.isActive('link') ? 'bg-primary/20 text-primary' : 'text-muted'
                    }`}
                    title="Add Link"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={triggerImageUpload}
                    disabled={uploading}
                    className={`p-2 rounded hover:bg-surface transition-colors text-muted ${uploading ? 'opacity-50' : ''}`}
                    title="Upload Image"
                >
                    {uploading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="m21 15-5-5L5 21" />
                        </svg>
                    )}
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Undo/Redo */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-surface transition-colors text-muted disabled:opacity-50"
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 7v6h6" />
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-surface transition-colors text-muted disabled:opacity-50"
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 7v6h-6" />
                        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
                    </svg>
                </button>
            </div>

            {/* Uploading indicator */}
            {uploading && (
                <div className="bg-primary/10 text-primary text-sm px-4 py-2 flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
                    </svg>
                    Mengupload gambar...
                </div>
            )}

            {/* Editor Content */}
            <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:rounded-lg"
            />
        </div>
    );
}
