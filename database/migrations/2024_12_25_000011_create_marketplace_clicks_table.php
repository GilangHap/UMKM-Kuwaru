<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel marketplace_clicks untuk tracking klik link marketplace.
     * Berguna untuk mengukur konversi ke platform eksternal.
     */
    public function up(): void
    {
        Schema::create('marketplace_clicks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke UMKM
            $table->foreignUuid('umkm_id')->constrained('umkms')->cascadeOnDelete();
            
            // Platform marketplace yang diklik
            $table->string('platform'); // shopee, tokopedia, traveloka, tiket
            
            // Data tracking
            $table->timestamp('clicked_at')->useCurrent();
            $table->string('ip_address', 45); // IPv6 compatible

            // Indexes untuk analytics
            $table->index('umkm_id');
            $table->index('platform');
            $table->index('clicked_at');
            
            // Compound index untuk laporan per UMKM per platform
            $table->index(['umkm_id', 'platform']);
            $table->index(['umkm_id', 'clicked_at']);
        });

        // Check constraint untuk platform enum (PostgreSQL)
        DB::statement("ALTER TABLE marketplace_clicks ADD CONSTRAINT marketplace_clicks_platform_check CHECK (platform IN ('shopee', 'tokopedia', 'traveloka', 'tiket'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_clicks');
    }
};
