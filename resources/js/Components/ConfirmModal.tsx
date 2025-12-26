import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

/**
 * ConfirmModal - Modal konfirmasi untuk aksi penting
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    variant = 'danger',
    loading = false,
}: ConfirmModalProps) {
    const variantStyles = {
        danger: {
            icon: (
                <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            iconBg: 'bg-error/10',
            button: 'bg-error hover:bg-red-700 focus:ring-error/50',
        },
        warning: {
            icon: (
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            iconBg: 'bg-warning/10',
            button: 'bg-warning hover:bg-amber-600 focus:ring-warning/50',
        },
        info: {
            icon: (
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            iconBg: 'bg-info/10',
            button: 'bg-info hover:bg-blue-600 focus:ring-info/50',
        },
    };

    const styles = variantStyles[variant];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-surface p-6 shadow-xl transition-all">
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 p-2 rounded-full ${styles.iconBg}`}>
                                        {styles.icon}
                                    </div>
                                    <div className="flex-1">
                                        <Dialog.Title className="text-lg font-semibold text-foreground">
                                            {title}
                                        </Dialog.Title>
                                        <div className="mt-2 text-sm text-muted">
                                            {message}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        {cancelLabel}
                                    </button>
                                    <button
                                        type="button"
                                        className={`inline-flex items-center justify-center px-4 py-2 text-white font-medium rounded-lg transition-all focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${styles.button}`}
                                        onClick={onConfirm}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Memproses...
                                            </>
                                        ) : (
                                            confirmLabel
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
