import { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import UmkmLayout from '@/Layouts/UmkmLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    user: {
        name: string;
        email: string;
        created_at: string;
    };
    umkm: {
        name: string;
        status: string;
    };
    flash?: { success?: string; error?: string };
}

export default function Index({ user, umkm, flash }: Props) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('umkm.account.password'), data, {
            onSuccess: () => {
                reset();
                setShowPasswordForm(false);
            },
        });
    };

    const handleLogout = () => {
        if (confirm('Yakin ingin keluar dari akun?')) {
            router.post(route('logout'));
        }
    };

    return (
        <UmkmLayout
            title="Akun"
            pageTitle="Pengaturan Akun"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Akun' },
            ]}
        >
            <div className="max-w-2xl space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {flash.error}
                    </div>
                )}

                {/* Account Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Informasi Akun
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-muted mb-1">Nama</label>
                            <p className="text-foreground font-medium">{user.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-1">Email</label>
                            <p className="text-foreground font-medium">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-1">UMKM</label>
                            <p className="text-foreground font-medium">{umkm.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-1">Status UMKM</label>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                umkm.status === 'active' 
                                    ? 'bg-success/10 text-success' 
                                    : umkm.status === 'suspended'
                                    ? 'bg-warning/10 text-warning'
                                    : 'bg-muted/10 text-muted'
                            }`}>
                                {umkm.status === 'active' ? 'Aktif' : 
                                 umkm.status === 'suspended' ? 'Ditangguhkan' : 'Tidak Aktif'}
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm text-muted mb-1">Terdaftar Sejak</label>
                            <p className="text-foreground">
                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Password */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Keamanan
                        </h2>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="text-sm text-primary hover:underline"
                            >
                                Ubah Password
                            </button>
                        )}
                    </div>

                    {showPasswordForm ? (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Password Saat Ini
                                </label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="input"
                                />
                                {errors.current_password && (
                                    <p className="text-sm text-error mt-1">{errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="input"
                                />
                                {errors.password && (
                                    <p className="text-sm text-error mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        reset();
                                    }}
                                    className="btn-secondary"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-muted">
                            Password Anda terakhir diubah... Klik "Ubah Password" untuk mengganti.
                        </p>
                    )}
                </div>

                {/* Logout */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Sesi Login
                    </h2>
                    <p className="text-sm text-muted mb-4">
                        Keluar dari akun UMKM Anda di perangkat ini.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary text-error border-error/30 hover:bg-error/10"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                    </button>
                </div>
            </div>
        </UmkmLayout>
    );
}
