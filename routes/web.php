<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Umkm\UmkmDashboardController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\UmkmDirectoryController;
use App\Http\Controllers\Public\ArticleController;
use App\Http\Controllers\Public\MapController;
use App\Http\Controllers\Public\AboutController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Guest)
|--------------------------------------------------------------------------
|
| Routes yang dapat diakses oleh siapapun (guest)
|
*/

// Homepage
Route::get('/', [HomeController::class, 'index'])->name('home');

// Direktori UMKM
Route::get('/umkm', [UmkmDirectoryController::class, 'index'])->name('umkm.directory');
Route::get('/umkm/{slug}', [UmkmDirectoryController::class, 'show'])->name('umkm.public.show');

// Artikel
Route::get('/artikel', [ArticleController::class, 'index'])->name('articles.public.index');
Route::get('/artikel/{slug}', [ArticleController::class, 'show'])->name('articles.public.show');

// Peta UMKM
Route::get('/peta-umkm', [MapController::class, 'index'])->name('map');

// Tentang Desa
Route::get('/tentang-desa', [AboutController::class, 'index'])->name('about');

/*
|--------------------------------------------------------------------------
| Admin Desa Routes
|--------------------------------------------------------------------------
|
| Routes yang hanya dapat diakses oleh admin_desa
| Prefix: /admin
| Middleware: auth, verified (opsional), active, role:admin_desa
|
*/

Route::middleware(['auth', 'active', 'role:admin_desa'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        // UMKM Management
        Route::resource('umkm', \App\Http\Controllers\Admin\AdminUmkmController::class);
        Route::post('/umkm/{umkm}/toggle-status', [\App\Http\Controllers\Admin\AdminUmkmController::class, 'toggleStatus'])
            ->name('umkm.toggle-status');
        Route::post('/umkm/{umkm}/toggle-featured', [\App\Http\Controllers\Admin\AdminUmkmController::class, 'toggleFeatured'])
            ->name('umkm.toggle-featured');

        // User Management (Admin UMKM accounts)
        Route::get('/users', [\App\Http\Controllers\Admin\AdminUserController::class, 'index'])
            ->name('users.index');
        Route::post('/users/{user}/toggle-active', [\App\Http\Controllers\Admin\AdminUserController::class, 'toggleActive'])
            ->name('users.toggle-active');
        Route::post('/users/{user}/reset-password', [\App\Http\Controllers\Admin\AdminUserController::class, 'resetPassword'])
            ->name('users.reset-password');

        // Category Management
        Route::resource('categories', \App\Http\Controllers\Admin\AdminCategoryController::class)
            ->except(['show', 'create', 'edit']);

        // Article Management & Moderation
        Route::get('/articles', [\App\Http\Controllers\Admin\AdminArticleController::class, 'index'])
            ->name('articles.index');
        Route::get('/articles/create', [\App\Http\Controllers\Admin\AdminArticleController::class, 'create'])
            ->name('articles.create');
        Route::post('/articles', [\App\Http\Controllers\Admin\AdminArticleController::class, 'store'])
            ->name('articles.store');
        Route::get('/articles/{article}', [\App\Http\Controllers\Admin\AdminArticleController::class, 'show'])
            ->name('articles.show');
        Route::get('/articles/{article}/edit', [\App\Http\Controllers\Admin\AdminArticleController::class, 'edit'])
            ->name('articles.edit');
        Route::put('/articles/{article}', [\App\Http\Controllers\Admin\AdminArticleController::class, 'update'])
            ->name('articles.update');
        Route::post('/articles/{article}/approve', [\App\Http\Controllers\Admin\AdminArticleController::class, 'approve'])
            ->name('articles.approve');
        Route::post('/articles/{article}/reject', [\App\Http\Controllers\Admin\AdminArticleController::class, 'reject'])
            ->name('articles.reject');

        // Statistics
        Route::get('/statistics', [\App\Http\Controllers\Admin\AdminStatisticsController::class, 'index'])
            ->name('statistics.index');

        // Settings
        Route::get('/settings', [\App\Http\Controllers\Admin\AdminSettingsController::class, 'index'])
            ->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\Admin\AdminSettingsController::class, 'update'])
            ->name('settings.update');

        // Activity Logs
        Route::get('/activity-logs', [\App\Http\Controllers\Admin\AdminActivityLogController::class, 'index'])
            ->name('activity-logs.index');
        
        // Editor Image Upload
        Route::post('/editor/upload-image', [\App\Http\Controllers\Admin\EditorImageController::class, 'upload'])
            ->name('editor.upload-image');
        
        // Google Maps URL Resolver
        Route::post('/maps/resolve', [\App\Http\Controllers\Admin\GoogleMapsController::class, 'resolveUrl'])
            ->name('maps.resolve');
    });

/*
|--------------------------------------------------------------------------
| Admin UMKM Routes
|--------------------------------------------------------------------------
|
| Routes yang hanya dapat diakses oleh admin_umkm
| Prefix: /umkm
| Middleware: auth, active, role:admin_umkm, umkm.linked
|
*/

Route::middleware(['auth', 'active', 'role:admin_umkm', 'umkm.linked'])
    ->prefix('umkm')
    ->name('umkm.')
    ->group(function () {
        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\Umkm\UmkmDashboardController::class, 'index'])
            ->name('dashboard');

        // Profile
        Route::get('/profile', [\App\Http\Controllers\Umkm\UmkmProfileController::class, 'edit'])
            ->name('profile.edit');
        Route::put('/profile', [\App\Http\Controllers\Umkm\UmkmProfileController::class, 'update'])
            ->name('profile.update');
        Route::post('/profile/resolve-map', [\App\Http\Controllers\Umkm\UmkmProfileController::class, 'resolveMapUrl'])
            ->name('profile.resolve-map');

        // Branding
        Route::get('/branding', [\App\Http\Controllers\Umkm\UmkmBrandingController::class, 'edit'])
            ->name('branding.edit');
        Route::put('/branding', [\App\Http\Controllers\Umkm\UmkmBrandingController::class, 'update'])
            ->name('branding.update');
        Route::post('/branding/reset', [\App\Http\Controllers\Umkm\UmkmBrandingController::class, 'reset'])
            ->name('branding.reset');

        // Products
        Route::resource('products', \App\Http\Controllers\Umkm\UmkmProductController::class);

        // Articles
        Route::resource('articles', \App\Http\Controllers\Umkm\UmkmArticleController::class);

        // Statistics
        Route::get('/statistics', [\App\Http\Controllers\Umkm\UmkmStatisticsController::class, 'index'])
            ->name('statistics');

        // Account
        Route::get('/account', [\App\Http\Controllers\Umkm\UmkmAccountController::class, 'show'])
            ->name('account');
        Route::put('/account/password', [\App\Http\Controllers\Umkm\UmkmAccountController::class, 'updatePassword'])
            ->name('account.password');

        // Editor Image Upload
        Route::post('/editor/upload-image', [\App\Http\Controllers\Admin\EditorImageController::class, 'upload'])
            ->name('editor.upload');
    });

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Any Role)
|--------------------------------------------------------------------------
|
| Routes yang dapat diakses oleh semua user yang sudah login
|
*/

Route::middleware(['auth', 'active'])
    ->group(function () {
        // Profile management (dari Breeze)
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
|
| Routes untuk authentication (login, logout, password reset)
| Didefinisikan di routes/auth.php
|
*/

require __DIR__.'/auth.php';
