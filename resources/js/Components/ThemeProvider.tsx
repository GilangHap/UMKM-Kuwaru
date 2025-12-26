import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
}

/**
 * Site settings interface
 */
export interface SiteSettings {
    site_name: string;
    site_description?: string;
    site_logo?: string;
    contact_email?: string;
    contact_phone?: string;
    village_address?: string;
    map_center_lat?: number;
    map_center_lng?: number;
}

/**
 * Theme context value
 */
interface ThemeContextValue {
    theme: ThemeConfig;
    settings: SiteSettings;
    isDark: boolean;
    toggleDark: () => void;
}

/**
 * Default theme (Desa Kuwaru - Green)
 */
const defaultTheme: ThemeConfig = {
    primary: '22 163 74',      // green-600
    primaryLight: '34 197 94', // green-500
    primaryDark: '21 128 61',  // green-700
    secondary: '34 197 94',    // green-500
    accent: '250 204 21',      // yellow-400
};

/**
 * Default settings
 */
const defaultSettings: SiteSettings = {
    site_name: 'Desa Kuwaru',
    site_description: 'Platform Digital UMKM Desa Kuwaru',
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Convert hex color to RGB string
 */
function hexToRgb(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r} ${g} ${b}`;
}

/**
 * Apply theme CSS variables to document root
 */
function applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-primary-dark', theme.primaryDark);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
}

interface ThemeProviderProps {
    children: ReactNode;
    theme?: ThemeConfig;
    settings?: SiteSettings;
}

/**
 * ThemeProvider component
 * 
 * Wraps the app and provides theme context.
 * Injects CSS variables for dynamic theming.
 */
export function ThemeProvider({ 
    children, 
    theme: customTheme, 
    settings: customSettings 
}: ThemeProviderProps) {
    // Get shared props from Inertia
    const pageProps = usePage().props as any;
    
    // Merge theme (custom > page props > default)
    const theme: ThemeConfig = customTheme || pageProps.theme || defaultTheme;
    
    // Merge settings (custom > page props > default)
    const settings: SiteSettings = {
        ...defaultSettings,
        ...(pageProps.settings || {}),
        ...(customSettings || {}),
    };
    
    // Apply theme on mount and changes
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);
    
    // Dark mode state (disabled by default, ready for future)
    const isDark = false;
    const toggleDark = () => {
        // Future: implement dark mode toggle
        console.log('Dark mode toggle - coming soon');
    };
    
    return (
        <ThemeContext.Provider value={{ theme, settings, isDark, toggleDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    
    if (!context) {
        // Return defaults if used outside provider
        return {
            theme: defaultTheme,
            settings: defaultSettings,
            isDark: false,
            toggleDark: () => {},
        };
    }
    
    return context;
}

/**
 * Hook to get site settings
 */
export function useSiteSettings(): SiteSettings {
    const { settings } = useTheme();
    return settings;
}

/**
 * Helper to create UMKM theme from database values
 */
export function createUmkmTheme(
    primaryColor?: string,
    secondaryColor?: string,
    accentColor?: string
): ThemeConfig {
    const theme = { ...defaultTheme };
    
    if (primaryColor) {
        const rgb = hexToRgb(primaryColor);
        theme.primary = rgb;
        theme.primaryLight = rgb; // Can be adjusted
        theme.primaryDark = rgb;  // Can be adjusted
    }
    
    if (secondaryColor) {
        theme.secondary = hexToRgb(secondaryColor);
    }
    
    if (accentColor) {
        theme.accent = hexToRgb(accentColor);
    }
    
    return theme;
}

export default ThemeProvider;
