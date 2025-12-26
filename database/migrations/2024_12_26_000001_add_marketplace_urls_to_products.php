<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Menambahkan kolom marketplace links ke products.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('shopee_url', 500)->nullable()->after('is_featured');
            $table->string('tokopedia_url', 500)->nullable()->after('shopee_url');
            $table->string('other_marketplace_url', 500)->nullable()->after('tokopedia_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['shopee_url', 'tokopedia_url', 'other_marketplace_url']);
        });
    }
};
