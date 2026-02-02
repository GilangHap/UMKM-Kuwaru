import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

interface Props {
    settings: {
        site_name?: string;
        site_description?: string;
        village_name?: string;
        village_description?: string;
        village_vision?: string;
        village_address?: string;
        contact_email?: string;
        contact_phone?: string;
    };
    stats: {
        total_umkm: number;
    };
}

export default function About({ settings, stats }: Props) {
    return (
        <PublicLayout
            title="Tentang Desa Kuwaru"
            description={settings.village_description || 'Mengenal lebih dekat Desa Kuwaru dan program UMKM digitalnya'}
        >
            {/* ============================================= */}
            {/* HERO SECTION */}
            {/* ============================================= */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900" />
                
                {/* Animated Grid Background */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                
                {/* Floating Orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 mt-5 mb-5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-cyan-300 text-sm font-semibold tracking-wide uppercase">Tentang Kami</span>
                    </div>
                    
                    {/* Title */}
                    <h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                            {settings.village_name || 'Desa Kuwaru'}
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                        Mengenal lebih dekat desa kami dan program pemberdayaan <span className="text-cyan-400 font-semibold">UMKM digital</span>
                    </p>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* ABOUT VILLAGE SECTION */}
            {/* ============================================= */}
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-cyan-400 to-teal-400" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Profil Desa</h2>
                    </div>
                    
                    {settings.village_description ? (
                        <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                            {settings.village_description}
                        </p>
                    ) : (
                        <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                            <p>
                                Desa Kuwaru adalah sebuah desa yang terletak di wilayah Yogyakarta, Indonesia. 
                                Desa ini memiliki potensi ekonomi yang besar dengan berbagai pelaku Usaha Mikro, 
                                Kecil, dan Menengah (UMKM) yang menawarkan produk-produk berkualitas.
                            </p>
                            <p>
                                Dengan semangat gotong royong dan kerja sama, masyarakat Desa Kuwaru terus 
                                berupaya mengembangkan ekonomi lokal melalui digitalisasi UMKM. Platform ini 
                                hadir sebagai jembatan antara pelaku usaha desa dengan konsumen yang lebih luas.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================= */}
            {/* STATS SECTION */}
            {/* ============================================= */}
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
                </div>
                
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            UMKM <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Kami</span>
                        </h2>
                        <p className="text-slate-400">Platform ini mendukung pertumbuhan ekonomi lokal</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group rounded-3xl p-8 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-all duration-300 text-center hover:scale-105">
                            <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                                {stats.total_umkm}
                            </div>
                            <div className="text-slate-400">UMKM Terdaftar</div>
                        </div>
                        <div className="group rounded-3xl p-8 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 transition-all duration-300 text-center hover:scale-105">
                            <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                100%
                            </div>
                            <div className="text-slate-400">Produk Lokal</div>
                        </div>
                        <div className="group rounded-3xl p-8 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-pink-500/50 transition-all duration-300 text-center hover:scale-105">
                            <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                                ♥
                            </div>
                            <div className="text-slate-400">Dibuat dengan Cinta</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* VISION SECTION */}
            {/* ============================================= */}
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-emerald-500/20" />
                        <div className="absolute inset-0 backdrop-blur-xl" />
                        
                        <div className="relative p-8 md:p-12 border border-white/10 rounded-3xl">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-500/30 flex items-center justify-center border border-white/20">
                                    <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Visi UMKM Desa
                                </h2>
                            </div>
                            
                            <p className="text-lg md:text-xl text-slate-300 text-center leading-relaxed">
                                {settings.village_vision || 
                                    'Menjadikan Desa Kuwaru sebagai pusat UMKM unggulan yang mampu bersaing di era digital, dengan produk-produk berkualitas yang membawa nama baik desa dan meningkatkan kesejahteraan masyarakat.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* PLATFORM INFO SECTION */}
            {/* ============================================= */}
            <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                </div>
                
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Tentang <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Platform</span> Ini
                        </h2>
                        <p className="text-slate-400">Bagaimana platform ini membantu UMKM desa</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Feature 1 */}
                        <div className="group rounded-3xl p-6 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Visibilitas Online</h3>
                            <p className="text-slate-400">
                                Membantu UMKM desa hadir di dunia digital sehingga dapat dijangkau oleh 
                                konsumen dari berbagai wilayah.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group rounded-3xl p-6 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Branding Profesional</h3>
                            <p className="text-slate-400">
                                Setiap UMKM memiliki halaman profil yang dapat dikustomisasi untuk 
                                menampilkan brand mereka secara profesional.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group rounded-3xl p-6 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Statistik & Insight</h3>
                            <p className="text-slate-400">
                                Dashboard analitik membantu UMKM memahami performa dan perilaku 
                                pengunjung untuk pengambilan keputusan yang lebih baik.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group rounded-3xl p-6 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Koneksi Langsung</h3>
                            <p className="text-slate-400">
                                Integrasi dengan WhatsApp dan marketplace memudahkan konsumen untuk 
                                langsung terhubung dengan pelaku UMKM.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================= */}
            {/* CTA SECTION */}
            {/* ============================================= */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                {/* Animated Background */}
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" 
                    style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 10s ease infinite' }} 
                />
                
                {/* Mesh Pattern */}
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
                <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Jelajahi UMKM Kami
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Temukan produk-produk berkualitas dari pelaku usaha lokal Desa Kuwaru. 
                        Setiap pembelian Anda mendukung ekonomi desa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/umkm"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-xl shadow-black/20"
                        >
                            Lihat Semua UMKM
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            href="/peta-umkm"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Buka Peta UMKM
                        </Link>
                    </div>
                </div>
            </section>

            {/* CSS Animations */}
            <style>{`
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </PublicLayout>
    );
}
