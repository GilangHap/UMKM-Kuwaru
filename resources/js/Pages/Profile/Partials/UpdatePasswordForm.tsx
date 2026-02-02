import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="space-y-6">
            <p className="text-sm text-muted mb-6">
                Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
            </p>

            {/* Current Password */}
            <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-foreground mb-2">
                    Password Saat Ini
                </label>
                <input
                    id="current_password"
                    ref={currentPasswordInput}
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                    className="input"
                    placeholder="Masukkan password saat ini"
                />
                {errors.current_password && (
                    <p className="mt-2 text-sm text-error">{errors.current_password}</p>
                )}
            </div>

            {/* New Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password Baru
                </label>
                <input
                    id="password"
                    ref={passwordInput}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                    className="input"
                    placeholder="Masukkan password baru"
                />
                {errors.password && (
                    <p className="mt-2 text-sm text-error">{errors.password}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-2">
                    Konfirmasi Password
                </label>
                <input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                    className="input"
                    placeholder="Konfirmasi password baru"
                />
                {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-error">{errors.password_confirmation}</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary px-6 py-2.5"
                >
                    {processing ? 'Menyimpan...' : 'Ubah Password'}
                </button>

                {recentlySuccessful && (
                    <span className="text-sm text-success flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Password berhasil diubah!
                    </span>
                )}
            </div>
        </form>
    );
}
