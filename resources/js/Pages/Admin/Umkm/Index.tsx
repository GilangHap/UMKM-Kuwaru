import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';
import { PageProps, Umkm, Category } from '@/types';

interface Props extends PageProps {
    umkms: {
        data: Umkm[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
        sort?: string;
        direction?: string;
    };
}

export default function Index({ umkms, categories, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        umkm?: Umkm;
        action?: 'suspend' | 'activate' | 'delete';
    }>({ isOpen: false });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.umkm.index'), {
            search,
            category: categoryFilter,
            status: statusFilter,
        }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string) => {
        const params: Record<string, string> = {
            search,
            category: categoryFilter,
            status: statusFilter,
            [key]: value,
        };
        router.get(route('admin.umkm.index'), params, { preserveState: true });
    };

    const handleToggleStatus = (umkm: Umkm, status: string) => {
        router.post(route('admin.umkm.toggle-status', umkm.id), { status }, {
            preserveScroll: true,
            onSuccess: () => setConfirmModal({ isOpen: false }),
        });
    };

    const handleToggleFeatured = (umkm: Umkm) => {
        router.post(route('admin.umkm.toggle-featured', umkm.id), {}, {
            preserveScroll: true,
        });
    };

    const columns = [
        {
            key: 'name',
            label: 'UMKM',
            sortable: true,
            render: (umkm: Umkm) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">
                            {umkm.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{umkm.name}</p>
                        <p className="text-xs text-muted">{umkm.owner_name}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            label: 'Kategori',
            render: (umkm: Umkm) => (
                <span className="text-sm">{umkm.category?.name || '-'}</span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (umkm: Umkm) => (
                <StatusBadge status={umkm.status as any} />
            ),
        },
        {
            key: 'is_featured',
            label: 'Unggulan',
            render: (umkm: Umkm) => (
                <button
                    onClick={() => handleToggleFeatured(umkm)}
                    className="p-1 rounded hover:bg-surface-hover transition-colors"
                    title={umkm.is_featured ? 'Hapus dari unggulan' : 'Tandai sebagai unggulan'}
                >
                    {umkm.is_featured ? (
                        <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    )}
                </button>
            ),
            className: 'text-center',
        },
        {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (umkm: Umkm) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={route('admin.umkm.show', umkm.id)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                        title="Lihat Detail"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                    <Link
                        href={route('admin.umkm.edit', umkm.id)}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                        title="Edit"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </Link>
                    {umkm.status === 'active' ? (
                        <button
                            onClick={() => setConfirmModal({ isOpen: true, umkm, action: 'suspend' })}
                            className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-error transition-colors"
                            title="Tangguhkan"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={() => setConfirmModal({ isOpen: true, umkm, action: 'activate' })}
                            className="p-2 rounded-lg hover:bg-green-50 text-muted hover:text-success transition-colors"
                            title="Aktifkan"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={() => setConfirmModal({ isOpen: true, umkm, action: 'delete' })}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-error transition-colors"
                        title="Hapus"
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
            title="Manajemen UMKM"
            pageTitle="UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'UMKM' },
            ]}
            actions={
                <Link href={route('admin.umkm.create')} className="btn-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah UMKM
                </Link>
            }
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    {flash.success}
                </div>
            )}

            {/* Filters */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Cari nama UMKM atau pemilik..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            handleFilter('category', e.target.value);
                        }}
                        className="input lg:w-48"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            handleFilter('status', e.target.value);
                        }}
                        className="input lg:w-40"
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                        <option value="suspended">Ditangguhkan</option>
                    </select>
                    <button type="submit" className="btn-primary lg:w-auto">
                        Cari
                    </button>
                </form>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={umkms.data}
                pagination={{
                    links: umkms.links,
                    from: umkms.from,
                    to: umkms.to,
                    total: umkms.total,
                }}
                emptyMessage="Belum ada UMKM terdaftar."
            />

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={() => {
                    if (confirmModal.umkm && confirmModal.action) {
                        if (confirmModal.action === 'delete') {
                            router.delete(route('admin.umkm.destroy', confirmModal.umkm.id), {
                                preserveScroll: true,
                                onSuccess: () => setConfirmModal({ isOpen: false }),
                            });
                        } else {
                            const status = confirmModal.action === 'activate' ? 'active' : 'suspended';
                            handleToggleStatus(confirmModal.umkm, status);
                        }
                    }
                }}
                title={
                    confirmModal.action === 'delete' 
                        ? 'Hapus UMKM' 
                        : (confirmModal.action === 'activate' ? 'Aktifkan UMKM' : 'Tangguhkan UMKM')
                }
                message={
                    confirmModal.action === 'delete'
                        ? `Apakah Anda yakin ingin menghapus UMKM "${confirmModal.umkm?.name}"? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus.`
                        : (confirmModal.action === 'activate'
                            ? `Apakah Anda yakin ingin mengaktifkan UMKM "${confirmModal.umkm?.name}"?`
                            : `Apakah Anda yakin ingin menangguhkan UMKM "${confirmModal.umkm?.name}"? UMKM yang ditangguhkan tidak akan muncul di halaman publik.`)
                }
                confirmLabel={
                    confirmModal.action === 'delete' 
                        ? 'Hapus' 
                        : (confirmModal.action === 'activate' ? 'Aktifkan' : 'Tangguhkan')
                }
                variant={confirmModal.action === 'activate' ? 'info' : 'danger'}
            />
        </AdminLayout>
    );
}
