import { Link } from '@inertiajs/react';
import { useSiteSettings } from './ThemeProvider';

interface SiteLogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * SiteLogo - Komponen logo website
 * 
 * Mengambil logo dari settings database.
 * Fallback ke teks nama site jika tidak ada logo.
 */
export default function SiteLogo({ 
    className = '', 
    showText = true,
    size = 'md' 
}: SiteLogoProps) {
    const settings = useSiteSettings();
    
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
    };
    
    const textSizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl',
    };
    
    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            {settings.site_logo ? (
                <img 
                    src={settings.site_logo} 
                    alt={settings.site_name}
                    className={`${sizeClasses[size]} object-contain`}
                />
            ) : (
                <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                        {settings.site_name.charAt(0).toUpperCase()}
                    </span>
                </div>
            )}
            
            {showText && (
                <span className={`font-semibold text-foreground ${textSizeClasses[size]}`}>
                    {settings.site_name}
                </span>
            )}
        </Link>
    );
}
