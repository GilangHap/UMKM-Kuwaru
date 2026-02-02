import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <>
            <div className="space-y-4">
                <p className="text-sm text-muted">
                    Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen.
                    Sebelum menghapus akun, harap unduh data yang ingin Anda simpan.
                </p>

                <button
                    onClick={confirmUserDeletion}
                    className="px-6 py-2.5 bg-error hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                    Hapus Akun
                </button>
            </div>

            {/* Modal */}
            {confirmingUserDeletion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50"
                        onClick={closeModal}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-surface rounded-xl border border-border shadow-xl p-6">
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Apakah Anda yakin ingin menghapus akun?
                        </h2>
                        
                        <p className="text-sm text-muted mb-6">
                            Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus
                            secara permanen. Masukkan password Anda untuk mengkonfirmasi
                            penghapusan akun.
                        </p>

                        <form onSubmit={deleteUser}>
                            <div className="mb-6">
                                <label htmlFor="delete_password" className="block text-sm font-medium text-foreground mb-2">
                                    Password
                                </label>
                                <input
                                    id="delete_password"
                                    type="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password untuk konfirmasi"
                                    className="input"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-error">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn-secondary px-5 py-2.5"
                                >
                                    Batal
                                </button>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-error hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                                >
                                    {processing ? 'Menghapus...' : 'Hapus Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
