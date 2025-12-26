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
     * Tabel articles untuk konten SEO UMKM.
     * Mendukung moderasi dengan status workflow.
     * Dilengkapi field SEO untuk optimasi mesin pencari.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke UMKM pemilik artikel
            $table->foreignUuid('umkm_id')->constrained('umkms')->cascadeOnDelete();
            
            // Konten artikel
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable(); // Ringkasan untuk preview
            $table->longText('content'); // Konten utama (bisa HTML/Markdown)
            
            // Status moderasi
            $table->string('status')->default('draft'); // draft, pending, approved, rejected
            
            // SEO fields
            $table->string('seo_title')->nullable(); // Override title untuk SEO
            $table->text('seo_description')->nullable(); // Meta description
            
            // Publikasi
            $table->timestamp('published_at')->nullable();
            
            $table->timestamps();

            // Indexes untuk query
            $table->index('slug');
            $table->index('umkm_id');
            $table->index('status');
            $table->index('published_at');
            
            // Compound index untuk listing artikel published
            $table->index(['status', 'published_at']);
        });

        // Check constraint untuk status enum (PostgreSQL)
        DB::statement("ALTER TABLE articles ADD CONSTRAINT articles_status_check CHECK (status IN ('draft', 'pending', 'approved', 'rejected'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
