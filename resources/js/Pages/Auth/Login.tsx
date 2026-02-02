import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Props {
    status?: string;
    canResetPassword: boolean;
    siteLogo?: string | null;
    siteName?: string;
}

export default function Login({
    status,
    canResetPassword,
    siteLogo,
    siteName = 'UMKM Kuwaru',
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />
            
            {/* Full Screen Layout */}
            <div className="min-h-screen flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
                        
                        {/* Animated dots */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute w-2 h-2 rounded-full bg-emerald-400 top-1/4 left-1/4 animate-pulse" />
                            <div className="absolute w-2 h-2 rounded-full bg-teal-400 top-3/4 left-1/3 animate-pulse" style={{ animationDelay: '1s' }} />
                            <div className="absolute w-2 h-2 rounded-full bg-cyan-400 top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
                            <div className="absolute w-3 h-3 rounded-full bg-emerald-300 bottom-1/4 right-1/3 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
                        {/* Dual Logos */}
                        <div className="flex items-center gap-6 mb-8">
                            {/* Site Logo */}
                            {siteLogo ? (
                                <img 
                                    src={siteLogo} 
                                    alt="Logo Desa" 
                                    className="w-24 h-24 object-contain drop-shadow-2xl"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            )}
                            
                            {/* Separator */}
                            <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                            
                            {/* KKN Logo */}
                            <img 
                                src="/logoKKN.png" 
                                alt="Logo KKN UNSOED" 
                                className="w-24 h-24 object-contain drop-shadow-2xl"
                            />
                        </div>
                        
                        {/* Branding Text */}
                        <h1 className="text-4xl font-bold text-white mb-4 text-center">
                            {siteName}
                        </h1>
                        <p className="text-lg text-slate-300 text-center max-w-md mb-8">
                            Platform Digital UMKM Desa Kuwaru
                        </p>
                        
                        {/* KKN Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm text-slate-300">
                                KKN UNSOED Desa Kuwaru 2026
                            </span>
                        </div>
                        
                        {/* Features Preview */}
                        <div className="mt-12 space-y-4 text-slate-400">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Kelola profil & produk UMKM</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Publikasi artikel & berita</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Akses dashboard lengkap</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex flex-col items-center mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                {siteLogo ? (
                                    <img src={siteLogo} alt="Logo" className="w-16 h-16 object-contain" />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                )}
                                <img src="/logoKKN.png" alt="KKN" className="w-16 h-16 object-contain" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-800">{siteName}</h1>
                        </div>
                        
                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang!</h2>
                                <p className="text-slate-500">Masuk ke akun Anda untuk melanjutkan</p>
                            </div>
                            
                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                                    {status}
                                </div>
                            )}
                            
                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                                            placeholder="email@contoh.com"
                                            autoComplete="username"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                                
                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                        />
                                        {/* Password Visibility Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>
                                
                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="ml-2 text-sm text-slate-600">Ingat saya</span>
                                    </label>
                                    
                                    {/* {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            Lupa password?
                                        </Link>
                                    )} */}
                                </div>
                                
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Memproses...
                                        </span>
                                    ) : (
                                        'Masuk'
                                    )}
                                </button>
                            </form>
                        </div>
                        
                        {/* Back to Home */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali ke beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
