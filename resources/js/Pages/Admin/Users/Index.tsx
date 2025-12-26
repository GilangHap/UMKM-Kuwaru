import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmModal from '@/Components/ConfirmModal';
import { PageProps, User } from '@/types';

interface UserWithUmkm extends User {
    umkm?: {
        id: number;
        name: string;
    };
}

interface Props extends PageProps {
    users: {
        data: UserWithUmkm[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ users, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        user?: UserWithUmkm;
        action?: 'toggle' | 'reset';
    }>({ isOpen: false });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, status: statusFilter }, { preserveState: true });
    };

    const handleToggleActive = (user: UserWithUmkm) => {
        router.post(route('admin.users.toggle-active', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmModal({ isOpen: false }),
        });
    };

    const handleResetPassword = (user: UserWithUmkm) => {
        router.post(route('admin.users.reset-password', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmModal({ isOpen: false }),
        });
    };

    const columns = [
        {
            key: 'name',
            label: 'Pengguna',
            sortable: true,
            render: (user: UserWithUmkm) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'umkm',
            label: 'UMKM',
            render: (user: UserWithUmkm) => (
                <span className="text-sm">{user.umkm?.name || '-'}</span>
            ),
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (user: UserWithUmkm) => (
                <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
            ),
        },
        {
            key: 'created_at',
            label: 'Terdaftar',
            sortable: true,
            render: (user: UserWithUmkm) => (
                <span className="text-sm text-muted">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                </span>
            ),
        },
        {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (user: UserWithUmkm) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setConfirmModal({ isOpen: true, user, action: 'reset' })}
                        className="p-2 rounded-lg hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                        title="Reset Password"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setConfirmModal({ isOpen: true, user, action: 'toggle' })}
                        className={`p-2 rounded-lg transition-colors ${
                            user.is_active 
                                ? 'hover:bg-red-50 text-muted hover:text-error' 
                                : 'hover:bg-green-50 text-muted hover:text-success'
                        }`}
                        title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                        {user.is_active ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Manajemen Pengguna"
            pageTitle="Admin UMKM"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Pengguna' },
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

            {/* Filters */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input flex-1"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get(route('admin.users.index'), { search, status: e.target.value }, { preserveState: true });
                        }}
                        className="input lg:w-40"
                    >
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                    </select>
                    <button type="submit" className="btn-primary">
                        Cari
                    </button>
                </form>
            </div>

            {/* Info */}
            <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg text-info text-sm">
                <p>
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Halaman ini menampilkan daftar akun Admin UMKM. Untuk membuat akun baru, gunakan menu <strong>UMKM → Tambah UMKM</strong>.
                </p>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={users.data}
                pagination={{
                    links: users.links,
                    from: users.from,
                    to: users.to,
                    total: users.total,
                }}
                emptyMessage="Belum ada pengguna Admin UMKM."
            />

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={() => {
                    if (confirmModal.user) {
                        if (confirmModal.action === 'toggle') {
                            handleToggleActive(confirmModal.user);
                        } else if (confirmModal.action === 'reset') {
                            handleResetPassword(confirmModal.user);
                        }
                    }
                }}
                title={
                    confirmModal.action === 'toggle'
                        ? (confirmModal.user?.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun')
                        : 'Reset Password'
                }
                message={
                    confirmModal.action === 'toggle'
                        ? (confirmModal.user?.is_active
                            ? `Apakah Anda yakin ingin menonaktifkan akun "${confirmModal.user?.name}"? Pengguna tidak akan dapat login.`
                            : `Apakah Anda yakin ingin mengaktifkan akun "${confirmModal.user?.name}"?`)
                        : `Apakah Anda yakin ingin mereset password akun "${confirmModal.user?.name}"? Password baru akan ditampilkan setelah proses selesai.`
                }
                confirmLabel={
                    confirmModal.action === 'toggle'
                        ? (confirmModal.user?.is_active ? 'Nonaktifkan' : 'Aktifkan')
                        : 'Reset Password'
                }
                variant={confirmModal.action === 'toggle' && confirmModal.user?.is_active ? 'danger' : 'warning'}
            />
        </AdminLayout>
    );
}
