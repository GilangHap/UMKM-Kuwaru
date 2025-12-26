import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/DataTable';
import { PageProps } from '@/types';

interface ActivityLog {
    id: number;
    user_id: number;
    action: string;
    description: string;
    model_type: string | null;
    model_id: number | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
}

interface Props extends PageProps {
    logs: {
        data: ActivityLog[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        user_id?: string;
        action?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function Index({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.activity-logs.index'), {
            search,
            date_from: dateFrom,
            date_to: dateTo,
        }, { preserveState: true });
    };

    const getActionColor = (action: string) => {
        if (action.includes('create') || action.includes('store')) return 'text-success';
        if (action.includes('update')) return 'text-info';
        if (action.includes('delete') || action.includes('destroy')) return 'text-error';
        return 'text-muted';
    };

    const columns = [
        {
            key: 'created_at',
            label: 'Waktu',
            sortable: true,
            render: (log: ActivityLog) => (
                <div className="text-sm">
                    <p className="font-medium text-foreground">
                        {new Date(log.created_at).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-xs text-muted">
                        {new Date(log.created_at).toLocaleTimeString('id-ID')}
                    </p>
                </div>
            ),
        },
        {
            key: 'user',
            label: 'Pengguna',
            render: (log: ActivityLog) => (
                <span className="text-sm font-medium">{log.user?.name || 'System'}</span>
            ),
        },
        {
            key: 'action',
            label: 'Aksi',
            render: (log: ActivityLog) => (
                <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                    {log.action}
                </span>
            ),
        },
        {
            key: 'description',
            label: 'Deskripsi',
            render: (log: ActivityLog) => (
                <span className="text-sm text-muted">{log.description}</span>
            ),
        },
        {
            key: 'ip_address',
            label: 'IP Address',
            render: (log: ActivityLog) => (
                <span className="text-xs text-muted font-mono">{log.ip_address || '-'}</span>
            ),
        },
    ];

    return (
        <AdminLayout
            title="Activity Logs"
            pageTitle="Log Aktivitas"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Activity Logs' },
            ]}
        >
            {/* Info */}
            <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg text-info text-sm">
                <p>
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Log aktivitas mencatat semua tindakan penting yang dilakukan di sistem untuk tujuan audit dan keamanan.
                </p>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Cari aksi atau deskripsi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input flex-1"
                    />
                    <div className="flex gap-4">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="input"
                            placeholder="Dari tanggal"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="input"
                            placeholder="Sampai tanggal"
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Filter
                    </button>
                </form>
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={logs.data}
                pagination={{
                    links: logs.links,
                    from: logs.from,
                    to: logs.to,
                    total: logs.total,
                }}
                emptyMessage="Belum ada log aktivitas."
            />
        </AdminLayout>
    );
}
