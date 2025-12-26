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
     * Tabel page_views untuk tracking kunjungan halaman.
     * Digunakan untuk insight dan analytics dasar.
     * umkm_id nullable karena bisa tracking halaman non-UMKM (home).
     */
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Nullable karena bisa tracking halaman tanpa UMKM tertentu
            $table->foreignUuid('umkm_id')->nullable()->constrained('umkms')->cascadeOnDelete();
            
            // Tipe halaman yang dikunjungi
            $table->string('page_type'); // home, umkm, article
            
            // Slug halaman untuk identifikasi spesifik
            $table->string('page_slug');
            
            // Data visitor
            $table->string('ip_address', 45); // IPv6 compatible
            $table->text('user_agent')->nullable();
            
            // Waktu kunjungan
            $table->timestamp('viewed_at')->useCurrent();

            // Indexes untuk analytics query
            $table->index('umkm_id');
            $table->index('page_type');
            $table->index('viewed_at');
            $table->index('page_slug');
            
            // Compound index untuk laporan per periode
            $table->index(['umkm_id', 'viewed_at']);
            $table->index(['page_type', 'viewed_at']);
        });

        // Check constraint untuk page_type enum (PostgreSQL)
        DB::statement("ALTER TABLE page_views ADD CONSTRAINT page_views_page_type_check CHECK (page_type IN ('home', 'umkm', 'article'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
