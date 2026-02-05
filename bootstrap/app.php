<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'active' => \App\Http\Middleware\EnsureUserIsActive::class,
            'umkm.linked' => \App\Http\Middleware\EnsureUmkmLinked::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Custom error pages dengan Inertia
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            $statusCode = $response->getStatusCode();
            
            // Skip jika request API atau bukan error yang di-handle
            if ($request->expectsJson() || !in_array($statusCode, [400, 401, 402, 403, 404, 419, 429, 500, 503])) {
                return $response;
            }
            
            try {
                // Ambil setting untuk error pages (dengan fallback aman)
                $siteLogo = null;
                $siteName = 'UMKM Kuwaru';
                
                if (class_exists('\App\Models\Setting')) {
                    try {
                        $siteLogo = \App\Models\Setting::get('site_logo');
                        $siteName = \App\Models\Setting::get('site_name', 'UMKM Kuwaru');
                    } catch (\Exception $e) {
                        // Ignore error saat mengambil setting
                    }
                }
                
                // Map status code ke komponen error yang sesuai
                $errorPage = match($statusCode) {
                    403 => 'Errors/403',
                    404 => 'Errors/404',
                    500 => app()->environment('local') ? null : 'Errors/500',
                    503 => 'Errors/503',
                    400, 401, 402, 419, 429 => 'Errors/Error',
                    default => null,
                };
                
                // Render error page jika ada
                if ($errorPage) {
                    return Inertia::render($errorPage, [
                        'status' => $statusCode,
                        'siteLogo' => $siteLogo,
                        'siteName' => $siteName,
                    ])
                        ->toResponse($request)
                        ->setStatusCode($statusCode);
                }
            } catch (\Exception $e) {
                // Jika ada error saat render error page, fallback ke default
                // Log error untuk debugging
                if (app()->bound('log')) {
                    app('log')->error('Error rendering custom error page: ' . $e->getMessage());
                }
            }

            return $response;
        });
    })->create();
