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
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-20 md:py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {settings.village_name || 'Desa Kuwaru'}
                    </h1>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                        Mengenal lebih dekat desa kami dan program pemberdayaan UMKM digital
                    </p>
                </div>
            </section>

            {/* About Village */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Profil Desa</h2>
                        
                        {settings.village_description ? (
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {settings.village_description}
                            </p>
                        ) : (
                            <div className="space-y-4 text-gray-600">
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
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">UMKM Kami</h2>
                        <p className="text-gray-600">Platform ini mendukung pertumbuhan ekonomi lokal</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="text-5xl font-bold text-green-600 mb-2">{stats.total_umkm}</div>
                            <div className="text-gray-500">UMKM Terdaftar</div>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
                            <div className="text-gray-500">Produk Lokal</div>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                            <div className="text-5xl font-bold text-purple-600 mb-2">♥</div>
                            <div className="text-gray-500">Dibuat dengan Cinta</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 md:p-12">
                        <div className="text-center mb-8">
                            <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visi UMKM Desa</h2>
                        </div>
                        
                        {settings.village_vision ? (
                            <p className="text-lg text-gray-700 text-center leading-relaxed">
                                {settings.village_vision}
                            </p>
                        ) : (
                            <p className="text-lg text-gray-700 text-center leading-relaxed">
                                Menjadikan Desa Kuwaru sebagai pusat UMKM unggulan yang mampu bersaing 
                                di era digital, dengan produk-produk berkualitas yang membawa nama baik 
                                desa dan meningkatkan kesejahteraan masyarakat.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Platform Info */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang Platform Ini</h2>
                        <p className="text-gray-600">Bagaimana platform ini membantu UMKM desa</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visibilitas Online</h3>
                            <p className="text-gray-600">
                                Membantu UMKM desa hadir di dunia digital sehingga dapat dijangkau oleh 
                                konsumen dari berbagai wilayah.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Branding Profesional</h3>
                            <p className="text-gray-600">
                                Setiap UMKM memiliki halaman profil yang dapat dikustomisasi untuk 
                                menampilkan brand mereka secara profesional.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Statistik & Insight</h3>
                            <p className="text-gray-600">
                                Dashboard analitik membantu UMKM memahami performa dan perilaku 
                                pengunjung untuk pengambilan keputusan yang lebih baik.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Koneksi Langsung</h3>
                            <p className="text-gray-600">
                                Integrasi dengan WhatsApp dan marketplace memudahkan konsumen untuk 
                                langsung terhubung dengan pelaku UMKM.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Jelajahi UMKM Kami
                    </h2>
                    <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto">
                        Temukan produk-produk berkualitas dari pelaku usaha lokal Desa Kuwaru. 
                        Setiap pembelian Anda mendukung ekonomi desa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/umkm"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200"
                        >
                            Lihat Semua UMKM
                        </Link>
                        <Link
                            href="/peta-umkm"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            Buka Peta UMKM
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
