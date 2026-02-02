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
    // KKN Team Members
    const teamMembers = [
        { name: 'Gilang Hapizin', role: 'Web Developer', faculty: 'Teknik' },
        { name: 'Anggota Tim 2', role: 'Koordinator', faculty: 'Ekonomi' },
        { name: 'Anggota Tim 3', role: 'Dokumentasi', faculty: 'Sosial' },
        { name: 'Anggota Tim 4', role: 'Humas', faculty: 'Hukum' },
    ];

    return (
        <PublicLayout
            title="Tentang"
            description="Mengenal lebih dekat Desa Kuwaru dan Tim KKN UNSOED 2026 yang mengembangkan platform ini"
        >
            {/* ============================================= */}
            {/* HERO SECTION */}
            {/* ============================================= */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
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
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 mt-5 mb-6">
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
                        <br />
                        <span className="text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            × KKN UNSOED 2026
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                        Kolaborasi antara masyarakat desa dan mahasiswa dalam <span className="text-cyan-400 font-semibold">transformasi digital UMKM</span>
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
                                Desa Kuwaru adalah sebuah desa yang terletak di <span className="text-cyan-400 font-semibold">Kecamatan Kuwarasan, Kabupaten Kebumen, Jawa Tengah</span>. 
                                Desa ini memiliki potensi ekonomi yang besar dengan berbagai pelaku Usaha Mikro, 
                                Kecil, dan Menengah (UMKM) yang menawarkan produk-produk berkualitas khas Kebumen.
                            </p>
                            <p>
                                Terletak di kawasan pedesaan yang subur, Desa Kuwaru dikelilingi oleh area pertanian 
                                dan perkebunan yang menjadi sumber penghidupan masyarakat. Dengan semangat gotong royong 
                                dan kerja sama, masyarakat terus berupaya mengembangkan ekonomi lokal melalui digitalisasi UMKM.
                            </p>
                            <p>
                                Platform ini hadir sebagai jembatan antara pelaku usaha desa dengan konsumen yang lebih luas, 
                                memperkenalkan produk-produk unggulan Kebumen ke seluruh Indonesia.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================= */}
            {/* KKN UNSOED SECTION - HIGHLIGHT */}
            {/* ============================================= */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        <div className="absolute top-20 left-10 w-32 h-32 border border-emerald-500/30 rounded-full animate-pulse" />
                        <div className="absolute top-40 right-20 w-48 h-48 border border-cyan-500/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute bottom-20 left-1/3 w-24 h-24 border border-teal-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header with Logo */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
                        {/* KKN Logo */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20 p-3 shadow-2xl shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                                <img 
                                    src="/logoKKN.png" 
                                    alt="Logo KKN UNSOED" 
                                    className="w-full h-full object-contain rounded-full"
                                />
                            </div>
                        </div>
                        
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-emerald-300 text-xs font-semibold tracking-widest uppercase">The Creators</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
                                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    KKN UNSOED
                                </span>
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-300">
                                Desa Kuwaru <span className="text-cyan-400">2026</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* KKN Description Card */}
                    <div className="relative rounded-3xl overflow-hidden mb-16 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-cyan-600/20 group-hover:from-emerald-600/30 group-hover:to-cyan-600/30 transition-all duration-500" />
                        <div className="absolute inset-0 backdrop-blur-xl" />
                        
                        <div className="relative p-8 md:p-12 border border-white/10 rounded-3xl">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                        Apa itu <span className="text-emerald-400">KKN UNSOED</span>?
                                    </h3>
                                    <div className="space-y-4 text-slate-300 leading-relaxed">
                                        <p>
                                            <span className="font-semibold text-white">Kuliah Kerja Nyata (KKN)</span> adalah 
                                            program pengabdian masyarakat dari Universitas Jenderal Soedirman (UNSOED) yang 
                                            mengintegrasikan mahasiswa dengan komunitas desa untuk menciptakan dampak sosial nyata.
                                        </p>
                                        <p>
                                            Tim KKN UNSOED 2026 di Desa Kuwaru berfokus pada <span className="text-cyan-400 font-semibold">digitalisasi UMKM</span> — 
                                            membangun platform web modern ini untuk memperkenalkan produk-produk lokal berkualitas 
                                            ke pasar yang lebih luas.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-emerald-500/50 transition-colors group/card">
                                        <div className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2 group-hover/card:scale-110 transition-transform">
                                            {stats.total_umkm}+
                                        </div>
                                        <div className="text-sm text-slate-400">UMKM Diberdayakan</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-cyan-500/50 transition-colors group/card">
                                        <div className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 group-hover/card:scale-110 transition-transform">
                                            35
                                        </div>
                                        <div className="text-sm text-slate-400">Hari Pengabdian</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-purple-500/50 transition-colors group/card">
                                        <div className="text-4xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover/card:scale-110 transition-transform">
                                            11
                                        </div>
                                        <div className="text-sm text-slate-400">Mahasiswa KKN</div>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-orange-500/50 transition-colors group/card">
                                        <div className="text-4xl font-bold bg-gradient-to-br from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2 group-hover/card:scale-110 transition-transform">
                                            ∞
                                        </div>
                                        <div className="text-sm text-slate-400">Semangat & Dedikasi</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mission Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {/* Mission 1 */}
                        <div className="group p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-emerald-500/30">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Digitalisasi UMKM</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Menghadirkan UMKM desa ke dunia digital melalui platform web modern yang mudah diakses oleh siapa saja.
                            </p>
                        </div>
                        
                        {/* Mission 2 */}
                        <div className="group p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-cyan-500/30">
                                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Edukasi & Pelatihan</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Memberikan pendampingan dan pelatihan kepada pelaku UMKM dalam mengelola dan memasarkan produk secara online.
                            </p>
                        </div>
                        
                        {/* Mission 3 */}
                        <div className="group p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-purple-500/30">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Pemberdayaan Komunitas</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Membangun ekosistem yang mendukung pertumbuhan ekonomi lokal dan kemandirian masyarakat desa.
                            </p>
                        </div>
                    </div>
                    
                    {/* Quote Section */}
                    <div className="relative text-center max-w-3xl mx-auto">
                        <svg className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <p className="text-xl md:text-2xl text-slate-300 italic leading-relaxed mb-6">
                            "Pengabdian kami bukan hanya tentang membangun website, tetapi tentang membangun 
                            <span className="text-emerald-400 font-semibold"> harapan dan masa depan </span> 
                            bagi UMKM Desa Kuwaru."
                        </p>
                        <p className="text-cyan-400 font-semibold">— Tim KKN UNSOED 2026</p>
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
                                    Visi Bersama
                                </h2>
                            </div>
                            
                            <p className="text-lg md:text-xl text-slate-300 text-center leading-relaxed">
                                {settings.village_vision || 
                                    'Menjadikan Desa Kuwaru sebagai pusat UMKM unggulan yang mampu bersaing di era digital, dengan produk-produk berkualitas yang membawa nama baik desa dan meningkatkan kesejahteraan masyarakat melalui kolaborasi berkelanjutan antara masyarakat dan dunia akademik.'
                                }
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
