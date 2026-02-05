import { useState, useEffect, useRef } from 'react';

interface BoundaryEditorProps {
    initialBoundary: [number, number][];
    mapCenter: { lat: number; lng: number };
    onChange: (boundary: [number, number][]) => void;
}

/**
 * BoundaryEditor - Component untuk menggambar polygon batas desa
 * Menggunakan Leaflet dengan Leaflet.Draw plugin
 */
export default function BoundaryEditor({ initialBoundary, mapCenter, onChange }: BoundaryEditorProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const drawnItemsRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);
    const [pointCount, setPointCount] = useState(initialBoundary?.length || 0);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !mapContainerRef.current || mapInstanceRef.current) return;

        // Dynamic import Leaflet first, then Leaflet.Draw
        import('leaflet').then((L) => {
            // Make Leaflet globally available for leaflet-draw
            (window as any).L = L.default || L;
            
            return import('leaflet-draw').then(() => L.default || L);
        }).then((L) => {
            // Fix marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Create map
            const map = L.map(mapContainerRef.current!).setView([mapCenter.lat, mapCenter.lng], 14);
            mapInstanceRef.current = map;

            // Dark themed tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // Initialize FeatureGroup for drawn items
            const drawnItems = new L.FeatureGroup();
            drawnItemsRef.current = drawnItems;
            map.addLayer(drawnItems);

            // Add existing boundary if available
            if (initialBoundary && initialBoundary.length >= 3) {
                const polygon = L.polygon(initialBoundary, {
                    color: '#10b981',
                    weight: 3,
                    fillColor: '#10b981',
                    fillOpacity: 0.15,
                });
                drawnItems.addLayer(polygon);
                map.fitBounds(polygon.getBounds(), { padding: [50, 50] });
            }

            // Initialize draw control
            const drawControl = new (L.Control as any).Draw({
                position: 'topright',
                draw: {
                    polygon: {
                        allowIntersection: false,
                        drawError: {
                            color: '#ef4444',
                            message: '<strong>Error:</strong> Polygon tidak boleh berpotongan!',
                        },
                        shapeOptions: {
                            color: '#10b981',
                            weight: 3,
                            fillColor: '#10b981',
                            fillOpacity: 0.15,
                        },
                    },
                    polyline: false,
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    rectangle: false,
                },
                edit: {
                    featureGroup: drawnItems,
                    remove: true,
                },
            });
            map.addControl(drawControl);

            // Handle draw created
            map.on((L as any).Draw.Event.CREATED, (e: any) => {
                // Remove existing layers
                drawnItems.clearLayers();
                
                // Add new layer
                const layer = e.layer;
                drawnItems.addLayer(layer);
                
                // Get coordinates and notify parent
                const latlngs = layer.getLatLngs()[0];
                const coords: [number, number][] = latlngs.map((ll: any) => [ll.lat, ll.lng]);
                setPointCount(coords.length);
                setIsDrawing(false);
                onChange(coords);
            });

            // Handle draw edited
            map.on((L as any).Draw.Event.EDITED, (e: any) => {
                const layers = e.layers;
                layers.eachLayer((layer: any) => {
                    const latlngs = layer.getLatLngs()[0];
                    const coords: [number, number][] = latlngs.map((ll: any) => [ll.lat, ll.lng]);
                    setPointCount(coords.length);
                    onChange(coords);
                });
            });

            // Handle draw deleted
            map.on((L as any).Draw.Event.DELETED, () => {
                setPointCount(0);
                onChange([]);
            });

            // Handle draw start
            map.on((L as any).Draw.Event.DRAWSTART, () => {
                setIsDrawing(true);
            });

            // Handle draw stop
            map.on((L as any).Draw.Event.DRAWSTOP, () => {
                setIsDrawing(false);
            });
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [isClient, mapCenter.lat, mapCenter.lng]);

    // Helper to clear all boundaries
    const handleClearBoundary = () => {
        if (drawnItemsRef.current) {
            drawnItemsRef.current.clearLayers();
            setPointCount(0);
            onChange([]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                crossOrigin=""
            />
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"
                crossOrigin=""
            />

            {/* Instructions */}
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                        <p className="font-medium text-foreground mb-1">Cara Menggambar Batas Desa:</p>
                        <ol className="list-decimal list-inside text-muted space-y-1">
                            <li>Klik ikon <strong>polygon</strong> (pentagon) di toolbar kanan atas peta</li>
                            <li>Klik titik-titik di peta untuk membentuk batas wilayah</li>
                            <li>Klik titik pertama untuk menutup polygon</li>
                            <li>Gunakan tombol <strong>Edit</strong> untuk menggeser titik</li>
                            <li>Klik <strong>Simpan Pengaturan</strong> di bawah untuk menyimpan</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border">
                <div className="flex items-center gap-3">
                    {pointCount > 0 ? (
                        <>
                            <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
                            <span className="text-sm text-foreground">
                                Polygon aktif: <strong>{pointCount} titik</strong>
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="w-3 h-3 rounded-full bg-warning" />
                            <span className="text-sm text-muted">Belum ada batas yang digambar</span>
                        </>
                    )}
                    {isDrawing && (
                        <span className="text-xs text-primary font-medium animate-pulse">
                            — Sedang menggambar...
                        </span>
                    )}
                </div>
                {pointCount > 0 && (
                    <button
                        type="button"
                        onClick={handleClearBoundary}
                        className="text-sm text-error hover:text-error/80 font-medium transition-colors"
                    >
                        Hapus Batas
                    </button>
                )}
            </div>

            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden border border-border">
                {isClient ? (
                    <div ref={mapContainerRef} className="h-[400px] w-full" />
                ) : (
                    <div className="h-[400px] w-full flex items-center justify-center bg-surface-hover">
                        <div className="text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                            <p className="text-sm text-muted">Memuat peta...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
