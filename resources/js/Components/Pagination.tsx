import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

/**
 * Pagination - Komponen pagination untuk DataTable
 */
export default function Pagination({ links, className = '' }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <nav className={`flex items-center justify-center gap-1 ${className}`}>
            {links.map((link, index) => {
                // Skip "Previous" and "Next" if no URL
                if (index === 0 && !link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-2 text-sm text-muted cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                
                if (index === links.length - 1 && !link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-2 text-sm text-muted cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-2 text-sm text-muted"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            link.active
                                ? 'bg-primary text-white font-medium'
                                : 'text-muted hover:bg-surface-hover hover:text-foreground'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                );
            })}
        </nav>
    );
}
