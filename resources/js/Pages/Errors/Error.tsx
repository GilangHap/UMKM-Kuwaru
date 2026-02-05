import { Head, Link } from '@inertiajs/react';

interface Props {
    status: number;
    siteLogo?: string | null;
    siteName?: string;
}

const statusMessages: Record<number, { title: string; message: string; icon: JSX.Element; color: string }> = {
    400: {
        title: 'Bad Request',
        message: 'Permintaan Anda tidak dapat diproses karena format yang tidak valid.',
        icon: (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'yellow',
    },
    401: {
        title: 'Tidak Terautentikasi',
        message: 'Anda harus login terlebih dahulu untuk mengakses halaman ini.',
        icon: (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        color: 'orange',
    },
    402: {
        title: 'Payment Required',
        message: 'Pembayaran diperlukan untuk mengakses resource ini.',
        icon: (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
        color: 'indigo',
    },
    419: {
        title: 'Session Expired',
        message: 'Sesi Anda telah kedaluwarsa. Silakan muat ulang halaman dan coba lagi.',
        icon: (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'purple',
    },
    429: {
        title: 'Too Many Requests',
        message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.',
        icon: (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        color: 'red',
    },
};

export default function Error({ status, siteLogo, siteName = 'UMKM Kuwaru' }: Props) {
    const errorInfo = statusMessages[status] || {
        title: 'Terjadi Kesalahan',
        message: 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti.',
        icon: (
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        color: 'slate',
    };

    const colorClasses = {
        yellow: {
            bg: 'from-yellow-100 to-amber-100',
            text: 'from-yellow-600 to-amber-600',
            icon: 'text-yellow-600',
        },
        orange: {
            bg: 'from-orange-100 to-red-100',
            text: 'from-orange-600 to-red-600',
            icon: 'text-orange-600',
        },
        indigo: {
            bg: 'from-indigo-100 to-purple-100',
            text: 'from-indigo-600 to-purple-600',
            icon: 'text-indigo-600',
        },
        purple: {
            bg: 'from-purple-100 to-pink-100',
            text: 'from-purple-600 to-pink-600',
            icon: 'text-purple-600',
        },
        red: {
            bg: 'from-red-100 to-rose-100',
            text: 'from-red-600 to-rose-600',
            icon: 'text-red-600',
        },
        slate: {
            bg: 'from-slate-100 to-gray-100',
            text: 'from-slate-600 to-gray-600',
            icon: 'text-slate-600',
        },
    };

    const colors = colorClasses[errorInfo.color as keyof typeof colorClasses] || colorClasses.slate;

    return (
        <>
            <Head title={`${status} - ${errorInfo.title}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-slate-50 flex items-center justify-center p-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.08),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(100,116,139,0.06),transparent_50%)]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl" />
                </div>
                
                <div className="relative z-10 max-w-2xl w-full">
                    {/* Error Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center gap-4">
                                {siteLogo ? (
                                    <img 
                                        src={siteLogo} 
                                        alt="Logo" 
                                        className="w-16 h-16 md:w-20 md:h-20 object-contain"
                                    />
                                ) : (
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Error Icon & Code */}
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${colors.bg} mb-6`}>
                                <div className={colors.icon}>
                                    {errorInfo.icon}
                                </div>
                            </div>
                            
                            <h1 className={`text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colors.text} mb-4`}>
                                {status}
                            </h1>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                                {errorInfo.title}
                            </h2>
                            
                            <p className="text-slate-600 text-lg max-w-md mx-auto">
                                {errorInfo.message}
                            </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Kembali ke Beranda
                            </Link>
                            
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Halaman Sebelumnya
                            </button>
                        </div>
                        
                        {/* Additional Help */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <p className="text-center text-sm text-slate-500">
                                Butuh bantuan?{' '}
                                <Link 
                                    href="/tentang-desa" 
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Hubungi Kami
                                </Link>
                            </p>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-slate-500">
                            © 2026 {siteName} • KKN UNSOED Desa Kuwaru
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
