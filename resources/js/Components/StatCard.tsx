import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    iconBg?: string;
    trend?: {
        value: number;
        label: string;
        direction: 'up' | 'down' | 'neutral';
    };
}

/**
 * StatCard - Card statistik untuk dashboard
 */
export default function StatCard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    iconBg = 'bg-primary/10',
    trend 
}: StatCardProps) {
    const trendColors = {
        up: 'text-success',
        down: 'text-error',
        neutral: 'text-muted',
    };

    return (
        <div className="card p-6">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${iconBg}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trendColors[trend.direction]}`}>
                        {trend.direction === 'up' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        )}
                        {trend.direction === 'down' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        )}
                        <span className="font-medium">{trend.value}%</span>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-muted">{title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                {subtitle && (
                    <p className="text-xs text-muted mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
