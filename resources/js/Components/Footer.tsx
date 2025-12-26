import { useSiteSettings } from './ThemeProvider';

/**
 * Footer - Global footer component
 * 
 * Menampilkan:
 * - Nama desa
 * - Tahun & copyright
 * - Info program KKN
 */
export default function Footer() {
    const settings = useSiteSettings();
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            {settings.site_name}
                        </h3>
                        <p className="text-sm leading-relaxed">
                            {settings.site_description || 'Platform Digital UMKM untuk mendukung pertumbuhan ekonomi lokal desa.'}
                        </p>
                    </div>
                    
                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Kontak
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {settings.village_address && (
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{settings.village_address}</span>
                                </li>
                            )}
                            {settings.contact_email && (
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                                        {settings.contact_email}
                                    </a>
                                </li>
                            )}
                            {settings.contact_phone && (
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                                        {settings.contact_phone}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                    
                    {/* Program Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Tentang Program
                        </h4>
                        <p className="text-sm leading-relaxed">
                            Platform ini dikembangkan sebagai bagian dari program pemberdayaan UMKM desa 
                            untuk mendukung digitalisasi dan pemasaran produk lokal.
                        </p>
                    </div>
                </div>
                
                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-slate-800">
                    <p className="text-center text-sm">
                        © {currentYear} {settings.site_name}. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}
