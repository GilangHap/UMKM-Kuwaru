<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabel article_revisions untuk menyimpan riwayat revisi artikel.
     * Berguna untuk audit trail dan rollback jika diperlukan.
     * Hanya memiliki created_at (immutable records).
     */
    public function up(): void
    {
        Schema::create('article_revisions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke artikel
            $table->foreignUuid('article_id')->constrained('articles')->cascadeOnDelete();
            
            // Snapshot konten saat revisi
            $table->longText('content_snapshot');
            
            // Siapa yang mengedit
            $table->foreignUuid('edited_by')->constrained('users')->cascadeOnDelete();
            
            // Hanya created_at (revisi tidak pernah diupdate)
            $table->timestamp('created_at')->useCurrent();

            // Indexes
            $table->index('article_id');
            $table->index('edited_by');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_revisions');
    }
};
