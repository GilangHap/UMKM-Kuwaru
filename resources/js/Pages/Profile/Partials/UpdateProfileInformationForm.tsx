import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = (usePage().props as any).auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <p className="text-sm text-muted mb-6">
                Perbarui informasi profil dan alamat email akun Anda.
            </p>
            
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nama Lengkap
                </label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    autoComplete="name"
                    className="input"
                    placeholder="Masukkan nama lengkap"
                />
                {errors.name && (
                    <p className="mt-2 text-sm text-error">{errors.name}</p>
                )}
            </div>

            {/* Email Field - ReadOnly */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="input bg-surface-hover cursor-not-allowed opacity-70"
                    placeholder="Alamat email"
                />
                <p className="mt-1 text-xs text-muted">Email tidak dapat diubah</p>
            </div>

            {/* Email Verification Warning */}
            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-sm text-warning">
                        Alamat email Anda belum terverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline hover:opacity-80 transition-opacity"
                        >
                            Klik di sini untuk mengirim ulang email verifikasi.
                        </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                        <p className="mt-2 text-sm font-medium text-success">
                            Link verifikasi baru telah dikirim ke alamat email Anda.
                        </p>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary px-6 py-2.5"
                >
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>

                {recentlySuccessful && (
                    <span className="text-sm text-success flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tersimpan!
                    </span>
                )}
            </div>
        </form>
    );
}
