import { Head, Link } from '@inertiajs/react';

interface Props {
    status?: number;
    siteLogo?: string | null;
    siteName?: string;
}

export default function Error500({ status, siteLogo, siteName = 'UMKM Kuwaru' }: Props) {
    return (
        <>
            <Head title="500 - Terjadi Kesalahan Server" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 flex items-center justify-center p-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.08),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(217,119,6,0.06),transparent_50%)]" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
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
                            <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-6">
                                <svg className="w-12 h-12 md:w-16 md:h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            
                            <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-4">
                                500
                            </h1>
                            
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                                Terjadi Kesalahan Server
                            </h2>
                            
                            <p className="text-slate-600 text-lg max-w-md mx-auto">
                                Maaf, server mengalami masalah saat memproses permintaan Anda. Tim kami telah diberitahu dan sedang menangani masalah ini.
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
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Muat Ulang Halaman
                            </button>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium mb-1">Apa yang dapat Anda lakukan?</p>
                                        <ul className="space-y-1 text-amber-700">
                                            <li>• Tunggu beberapa saat dan coba lagi</li>
                                            <li>• Muat ulang halaman ini</li>
                                            <li>• Kembali ke halaman sebelumnya</li>
                                            <li>• Hubungi administrator jika masalah berlanjut</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
