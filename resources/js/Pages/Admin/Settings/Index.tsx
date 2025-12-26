import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';

interface Props extends PageProps {
    settings: {
        site_name: string;
        site_description: string;
        site_logo: string | null;
        contact_email: string;
        contact_phone: string;
        village_address: string;
        footer_text: string;
        map_center_lat: number;
        map_center_lng: number;
    };
}

export default function Index({ settings }: Props) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        site_logo: null as File | null,
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        village_address: settings.village_address || '',
        footer_text: settings.footer_text || '',
        map_center_lat: settings.map_center_lat || -7.9797,
        map_center_lng: settings.map_center_lng || 110.2827,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            title="Pengaturan"
            pageTitle="Pengaturan Website"
            breadcrumbs={[
                { label: 'Dashboard', href: route('admin.dashboard') },
                { label: 'Pengaturan' },
            ]}
        >
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                    {flash.success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* General Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Informasi Umum</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nama Website <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                                className="input"
                                placeholder="Desa Kuwaru"
                            />
                            {errors.site_name && (
                                <p className="text-sm text-error mt-1">{errors.site_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Deskripsi Website
                            </label>
                            <textarea
                                value={data.site_description}
                                onChange={(e) => setData('site_description', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Deskripsi singkat untuk SEO"
                            />
                            <p className="text-xs text-muted mt-1">Digunakan untuk meta description SEO</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Logo Desa
                            </label>
                            {settings.site_logo && (
                                <div className="mb-2">
                                    <img 
                                        src={settings.site_logo} 
                                        alt="Logo" 
                                        className="w-20 h-20 object-contain rounded-lg border border-border"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('site_logo', e.target.files?.[0] || null)}
                                className="input"
                            />
                            <p className="text-xs text-muted mt-1">Format: JPG, PNG, SVG. Maksimal 2MB.</p>
                            {errors.site_logo && (
                                <p className="text-sm text-error mt-1">{errors.site_logo}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Informasi Kontak</h2>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Email Kontak
                                </label>
                                <input
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    className="input"
                                    placeholder="admin@desakuwaru.id"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">
                                    Telepon Kontak
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                    className="input"
                                    placeholder="0274-123456"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Alamat Desa
                            </label>
                            <textarea
                                value={data.village_address}
                                onChange={(e) => setData('village_address', e.target.value)}
                                className="input min-h-[80px]"
                                placeholder="Alamat lengkap desa"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Footer</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Teks Footer
                        </label>
                        <textarea
                            value={data.footer_text}
                            onChange={(e) => setData('footer_text', e.target.value)}
                            className="input min-h-[80px]"
                            placeholder="Teks tambahan di footer"
                        />
                    </div>
                </div>

                {/* Map Settings */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-6">Pengaturan Peta</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Latitude Pusat
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={data.map_center_lat}
                                onChange={(e) => setData('map_center_lat', parseFloat(e.target.value))}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Longitude Pusat
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={data.map_center_lng}
                                onChange={(e) => setData('map_center_lng', parseFloat(e.target.value))}
                                className="input"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">Digunakan untuk pusat peta UMKM</p>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
