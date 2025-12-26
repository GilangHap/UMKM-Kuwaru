import { ReactNode } from 'react';
import Pagination from './Pagination';

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T, index: number) => ReactNode;
    className?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    pagination?: {
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (key: string) => void;
    emptyMessage?: string;
    loading?: boolean;
}

/**
 * DataTable - Reusable table component dengan sorting dan pagination
 */
export default function DataTable<T extends { id: string | number }>({
    columns,
    data,
    pagination,
    sortBy,
    sortDirection = 'asc',
    onSort,
    emptyMessage = 'Tidak ada data.',
    loading = false,
}: DataTableProps<T>) {
    const handleSort = (key: string) => {
        if (onSort) {
            onSort(key);
        }
    };

    return (
        <div className="card overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-surface-hover">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider ${
                                        column.sortable ? 'cursor-pointer select-none hover:text-foreground' : ''
                                    } ${column.className || ''}`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.label}
                                        {column.sortable && (
                                            <span className="flex flex-col">
                                                <svg
                                                    className={`w-3 h-3 -mb-1 ${
                                                        sortBy === column.key && sortDirection === 'asc'
                                                            ? 'text-primary'
                                                            : 'text-muted-foreground/40'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M5 10l5-5 5 5H5z" />
                                                </svg>
                                                <svg
                                                    className={`w-3 h-3 -mt-1 ${
                                                        sortBy === column.key && sortDirection === 'desc'
                                                            ? 'text-primary'
                                                            : 'text-muted-foreground/40'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M15 10l-5 5-5-5h10z" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span className="text-muted">Memuat...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-12 h-12 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-muted text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr 
                                    key={item.id} 
                                    className="hover:bg-surface-hover transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td 
                                            key={column.key} 
                                            className={`px-6 py-4 text-sm ${column.className || ''}`}
                                        >
                                            {column.render 
                                                ? column.render(item, index) 
                                                : (item as any)[column.key]
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.links.length > 3 && (
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted">
                        Menampilkan <span className="font-medium text-foreground">{pagination.from}</span> - <span className="font-medium text-foreground">{pagination.to}</span> dari <span className="font-medium text-foreground">{pagination.total}</span> data
                    </p>
                    <Pagination links={pagination.links} />
                </div>
            )}
        </div>
    );
}
