type StatusType = 
    | 'active' 
    | 'inactive' 
    | 'suspended' 
    | 'pending' 
    | 'approved' 
    | 'rejected' 
    | 'draft'
    | 'published'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';

interface StatusBadgeProps {
    status: StatusType;
    label?: string;
    size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
    active: { label: 'Aktif', className: 'bg-success/10 text-success' },
    inactive: { label: 'Tidak Aktif', className: 'bg-gray-100 text-gray-600' },
    suspended: { label: 'Ditangguhkan', className: 'bg-error/10 text-error' },
    pending: { label: 'Menunggu', className: 'bg-warning/10 text-warning' },
    approved: { label: 'Disetujui', className: 'bg-success/10 text-success' },
    rejected: { label: 'Ditolak', className: 'bg-error/10 text-error' },
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
    published: { label: 'Dipublikasi', className: 'bg-success/10 text-success' },
    success: { label: 'Berhasil', className: 'bg-success/10 text-success' },
    warning: { label: 'Peringatan', className: 'bg-warning/10 text-warning' },
    error: { label: 'Error', className: 'bg-error/10 text-error' },
    info: { label: 'Info', className: 'bg-info/10 text-info' },
};

/**
 * StatusBadge - Badge untuk menampilkan status
 */
export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.info;
    const displayLabel = label || config.label;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${config.className} ${sizeClasses[size]}`}>
            {displayLabel}
        </span>
    );
}
