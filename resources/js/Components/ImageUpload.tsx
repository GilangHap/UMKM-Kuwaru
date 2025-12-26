import { useState, useRef } from 'react';

interface ImageUploadProps {
    value?: string | null;
    onChange: (file: File | null) => void;
    onRemove?: () => void;
    accept?: string;
    maxSize?: number; // in MB
    className?: string;
}

/**
 * ImageUpload - Component for uploading and previewing images
 */
export default function ImageUpload({
    value,
    onChange,
    onRemove,
    accept = 'image/*',
    maxSize = 2,
    className = '',
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setPreview(null);
            onChange(null);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar');
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Ukuran file maksimal ${maxSize}MB`);
            return;
        }

        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onChange(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onRemove?.();
    };

    return (
        <div className={className}>
            {preview ? (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-error text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragging 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-surface-hover'
                        }
                    `}
                >
                    <svg 
                        className="w-12 h-12 mx-auto text-muted mb-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                    </svg>
                    <p className="text-sm text-foreground font-medium mb-1">
                        Klik atau drag & drop gambar
                    </p>
                    <p className="text-xs text-muted">
                        PNG, JPG, GIF hingga {maxSize}MB
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-error mt-2">{error}</p>
            )}
        </div>
    );
}
