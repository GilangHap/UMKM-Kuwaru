import { useState, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps, Umkm, MediaFile } from '@/types';

interface Props extends PageProps {
    umkm: Umkm & { gallery: MediaFile[] };
}

export default function Gallery({ umkm }: Props) {
    const { flash } = usePage<PageProps & { flash: { success?: string; error?: string } }>().props;
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
    };

    const handleUpload = (files: FileList) => {
        setUploading(true);
        
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('images[]', file);
        });

        router.post(route('admin.umkm.gallery.upload', umkm.id), formData, {
            forceFormData: true,
            onFinish: () => {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleDelete = (mediaId: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
            router.delete(route('admin.umkm.gallery.delete', { umkm: umkm.id, media: mediaId }));
        }
    };

    const handleReorder = (dragIndex: number, dropIndex: number) => {
        if (dragIndex === dropIndex) return;
        
        const newOrder = [...umkm.gallery];
        const [removed] = newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, removed);
        
        router.put(route('admin.umkm.gallery.reorder', umkm.id), {
            order: newOrder.map((m) => m.id),
        });
    };

    return (
        <AdminLayout
            title={`Galeri Foto - ${umkm.name}`}
            pageTitle="Galeri Foto UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'UMKM', href: route('admin.umkm.index') },
                { label: umkm.name, href: route('admin.umkm.edit', umkm.id) },
                { label: 'Galeri' },
            ]}
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                    {flash.error}
                </div>
            )}

            {/* UMKM Info */}
            <div className="card p-4 mb-6 flex items-center gap-4">
                {umkm.logo ? (
                    <img 
                        src={umkm.logo.url || `/storage/${umkm.logo.file_path}`}
                        alt={umkm.name}
                        className="h-12 w-12 rounded-lg object-cover"
                    />
                ) : (
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                            {umkm.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                <div>
                    <h2 className="font-semibold text-foreground">{umkm.name}</h2>
                    <p className="text-sm text-muted">{umkm.category?.name}</p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Upload Foto</h3>
                <div
                    className={`
                        border-2 border-dashed rounded-xl p-8 text-center transition-all
                        ${dragActive 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }
                        ${uploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="gallery-upload"
                    />
                    
                    <div className="flex flex-col items-center">
                        {uploading ? (
                            <>
                                <svg className="w-12 h-12 text-primary animate-spin mb-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <p className="text-foreground font-medium">Mengupload...</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-12 h-12 text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-foreground font-medium mb-2">
                                    Drag & drop foto di sini
                                </p>
                                <p className="text-sm text-muted mb-4">
                                    atau
                                </p>
                                <label
                                    htmlFor="gallery-upload"
                                    className="btn-primary cursor-pointer"
                                >
                                    Pilih Foto
                                </label>
                                <p className="text-xs text-muted mt-4">
                                    Format: JPEG, PNG, GIF, WebP. Maks 5MB per file.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Foto UMKM ({umkm.gallery?.length || 0})
                </h3>
                
                {umkm.gallery && umkm.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {umkm.gallery.map((media, index) => (
                            <div
                                key={media.id}
                                className="group relative aspect-square rounded-xl overflow-hidden bg-surface-hover"
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                    handleReorder(dragIndex, index);
                                }}
                            >
                                <img
                                    src={media.url || `/storage/${media.file_path}`}
                                    alt={media.alt_text || 'Gallery image'}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleDelete(media.id)}
                                        className="p-2 bg-error rounded-lg text-white hover:bg-error/80 transition-colors"
                                        title="Hapus foto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Order Badge */}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
                                    {index + 1}
                                </div>
                                
                                {/* Drag Handle */}
                                <div className="absolute top-2 right-2 p-1 bg-black/60 rounded text-white cursor-move">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted">
                        <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-medium">Belum ada foto</p>
                        <p className="text-sm">Upload foto untuk menampilkan galeri UMKM</p>
                    </div>
                )}
                
                <p className="text-xs text-muted mt-4">
                    💡 Tip: Drag foto untuk mengubah urutan. Foto pertama akan menjadi thumbnail utama.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <a
                    href={route('admin.umkm.index')}
                    className="btn-primary"
                >
                    Selesai
                </a>
                <a
                    href={route('admin.umkm.edit', umkm.id)}
                    className="btn-secondary"
                >
                    Edit Data UMKM
                </a>
            </div>
        </AdminLayout>
    );
}
