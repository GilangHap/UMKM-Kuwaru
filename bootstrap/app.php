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
        // Handle 403 Forbidden untuk Inertia
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if ($response->getStatusCode() === 403) {
                return Inertia::render('Errors/Forbidden')
                    ->toResponse($request)
                    ->setStatusCode(403);
            }

            // Handle 404 Not Found
            if ($response->getStatusCode() === 404 && !app()->environment('local')) {
                return Inertia::render('Errors/NotFound')
                    ->toResponse($request)
                    ->setStatusCode(404);
            }

            // Handle 500 Internal Server Error
            if ($response->getStatusCode() === 500 && !app()->environment('local')) {
                return Inertia::render('Errors/ServerError')
                    ->toResponse($request)
                    ->setStatusCode(500);
            }

            return $response;
        });
    })->create();
