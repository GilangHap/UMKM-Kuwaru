<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            // Featured image
            $table->foreignUuid('featured_image_id')
                ->nullable()
                ->after('seo_description')
                ->constrained('media_files')
                ->nullOnDelete();
            
            // Approval tracking
            $table->foreignUuid('approved_by')
                ->nullable()
                ->after('status')
                ->constrained('users')
                ->nullOnDelete();
            
            $table->timestamp('approved_at')
                ->nullable()
                ->after('approved_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['featured_image_id']);
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['featured_image_id', 'approved_by', 'approved_at']);
        });
    }
};
