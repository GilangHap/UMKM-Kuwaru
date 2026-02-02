import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import UmkmLayout from '@/Layouts/UmkmLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin_desa';
    
    // Content yang sama untuk kedua layout (Light Mode)
    const content = (
        <>
            <Head title="Profil Saya" />
            
            {/* Hero Section */}
            <div className="card p-6 mb-8">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">{user?.name}</h1>
                        <p className="text-muted">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-primary text-xs font-medium uppercase tracking-wide">
                                {isAdmin ? 'Admin Desa' : 'Admin UMKM'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Form Sections */}
            <div className="space-y-6">
                {/* Update Profile Information */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informasi Profil
                        </h2>
                    </div>
                    <div className="p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Update Password */}
                <div className="card">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Ubah Password
                        </h2>
                    </div>
                    <div className="p-6">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Danger Zone - Delete Account */}
                <div className="card border-error/30">
                    <div className="px-6 py-4 border-b border-error/30 bg-error/5">
                        <h2 className="text-lg font-semibold text-error flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Zona Berbahaya
                        </h2>
                    </div>
                    <div className="p-6">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </>
    );
    
    // Render dengan layout yang sesuai
    if (isAdmin) {
        return (
            <AdminLayout 
                title="Profil Saya"
                pageTitle="Profil Saya"
                breadcrumbs={[
                    { label: 'Dashboard', href: route('admin.dashboard') },
                    { label: 'Profil' }
                ]}
            >
                {content}
            </AdminLayout>
        );
    }
    
    return (
        <UmkmLayout 
            title="Profil Saya"
            pageTitle="Profil Saya"
            breadcrumbs={[
                { label: 'Dashboard', href: route('umkm.dashboard') },
                { label: 'Profil' }
            ]}
        >
            {content}
        </UmkmLayout>
    );
}
