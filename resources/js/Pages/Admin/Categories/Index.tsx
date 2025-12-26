import { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import ConfirmModal from '@/Components/ConfirmModal';
import { PageProps, Category } from '@/types';

interface CategoryWithCount extends Category {
    umkms_count: number;
}

interface Props extends PageProps {
    categories: {
        data: CategoryWithCount[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ categories, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; category?: CategoryWithCount }>({ isOpen: false });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        icon: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.categories.index'), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        reset();
        setEditingCategory(null);
        setShowModal(true);
    };

    const openEditModal = (category: CategoryWithCount) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
            icon: category.icon || '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (category: CategoryWithCount) => {
        router.delete(route('admin.categories.destroy', category.id), {
            onSuccess: () => setDeleteConfirm({ isOpen: false }),
        });
    };

    const columns = [
        {
            key: 'name',
            label: 'Kategori',
            sortable: true,
            render: (cat: CategoryWithCount) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {cat.icon ? (
                            <span className="text-lg">{cat.icon}</span>
                        ) : (
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{cat.name}</p>
                        <p className="text-xs text-muted">{cat.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Deskripsi',
            render: (cat: CategoryWithCount) => (
                <span className="text-sm text-muted line-clamp-2">{cat.description || '-'}</span>
            ),
        },
        {
            key: 'umkms_count',
            label: 'Jumlah UMKM',
            className: 'text-center',
            render: (cat: CategoryWithCount) => (
                <span className="px-2 py-1 bg-surface-hover rounded-full text-sm font-medium">
                    {cat.umkms_count}
                </span>
            ),
        },
        {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (cat: CategoryWithCount) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setDeleteConfirm({ isOpen: true, category: cat })}
                        className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-error transition-colors"
                        title="Hapus"
                        disabled={cat.umkms_count > 0}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Manajemen Kategori"
            pageTitle="Kategori"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Kategori' },
            ]}
            actions={
                <button onClick={openCreateModal} className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kategori
                </button>
            }
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

            {/* Search */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input flex-1"
                    />
                    <button type="submit" className="btn-primary">
                        Cari
                    </button>
                </form>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={categories.data}
                pagination={{
                    links: categories.links,
                    from: categories.from,
                    to: categories.to,
                    total: categories.total,
                }}
                emptyMessage="Belum ada kategori."
            />

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Nama Kategori <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="input"
                                        placeholder="Contoh: Kuliner, Kerajinan"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-error mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="input min-h-[80px]"
                                        placeholder="Deskripsi singkat kategori"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Icon (Emoji)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        className="input"
                                        placeholder="🍽️"
                                    />
                                    <p className="text-xs text-muted mt-1">Gunakan emoji untuk icon kategori</p>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-primary"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false })}
                onConfirm={() => deleteConfirm.category && handleDelete(deleteConfirm.category)}
                title="Hapus Kategori"
                message={`Apakah Anda yakin ingin menghapus kategori "${deleteConfirm.category?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="danger"
            />
        </AdminLayout>
    );
}
