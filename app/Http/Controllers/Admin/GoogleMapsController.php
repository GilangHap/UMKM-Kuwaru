<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleMapsController extends Controller
{
    /**
     * Resolve a Google Maps short URL and extract coordinates.
     */
    public function resolveUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $url = $request->url;
        
        try {
            // If it's a shortened URL, follow the redirect
            if (str_contains($url, 'goo.gl') || str_contains($url, 'maps.app')) {
                $resolvedUrl = $this->followRedirects($url);
                if ($resolvedUrl) {
                    $url = $resolvedUrl;
                }
            }
            
            Log::info('Google Maps URL resolved', ['original' => $request->url, 'resolved' => $url]);
            
            // Extract coordinates from the full URL
            $coords = $this->extractCoordinates($url);
            
            if ($coords) {
                return response()->json([
                    'success' => true,
                    'latitude' => $coords['lat'],
                    'longitude' => $coords['lng'],
                    'resolvedUrl' => $url,
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat mengekstrak koordinat dari URL yang resolved',
                'resolvedUrl' => $url,
            ]);
            
        } catch (\Exception $e) {
            Log::error('Google Maps URL resolve error', [
                'url' => $request->url,
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses URL: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Follow redirects to get final URL.
     */
    private function followRedirects(string $url, int $maxRedirects = 5): ?string
    {
        $currentUrl = $url;
        
        for ($i = 0; $i < $maxRedirects; $i++) {
            // Make request without following redirects to get Location header
            $response = Http::withOptions([
                'allow_redirects' => false,
                'verify' => false, // Skip SSL verification for local dev
            ])->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ])->get($currentUrl);
            
            $statusCode = $response->status();
            
            // Check if it's a redirect
            if ($statusCode >= 300 && $statusCode < 400) {
                $location = $response->header('Location');
                if ($location) {
                    // Handle relative URLs
                    if (!str_starts_with($location, 'http')) {
                        $parsed = parse_url($currentUrl);
                        $location = $parsed['scheme'] . '://' . $parsed['host'] . $location;
                    }
                    $currentUrl = $location;
                    continue;
                }
            }
            
            // If not a redirect, we've reached the final URL
            break;
        }
        
        return $currentUrl !== $url ? $currentUrl : null;
    }
    
    /**
     * Extract coordinates from a Google Maps URL.
     */
    private function extractCoordinates(string $url): ?array
    {
        // Decode URL first
        $decodedUrl = urldecode($url);
        
        // Pattern 1: @-7.1234567,110.1234567
        if (preg_match('/@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $decodedUrl, $matches)) {
            return ['lat' => $matches[1], 'lng' => $matches[2]];
        }
        
        // Pattern 2: !3d-7.1234567!4d110.1234567
        if (preg_match('/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/', $decodedUrl, $matches)) {
            return ['lat' => $matches[1], 'lng' => $matches[2]];
        }
        
        // Pattern 3: q=-7.1234567,110.1234567 or ll=-7.1234567,110.1234567
        if (preg_match('/[?&](?:q|ll)=(-?\d+\.?\d*),(-?\d+\.?\d*)/', $decodedUrl, $matches)) {
            return ['lat' => $matches[1], 'lng' => $matches[2]];
        }
        
        // Pattern 4: place/.../@-7.1234567,110.1234567
        if (preg_match('/place\/[^@]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/', $decodedUrl, $matches)) {
            return ['lat' => $matches[1], 'lng' => $matches[2]];
        }
        
        // Pattern 5: data=...!1d110.xxx!2d-7.xxx (different order - longitude first, then latitude)
        if (preg_match('/!1d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/', $decodedUrl, $matches)) {
            return ['lat' => $matches[2], 'lng' => $matches[1]];
        }
        
        // Pattern 6: ftid embedded coordinates in data string
        if (preg_match('/!8m2!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/', $decodedUrl, $matches)) {
            return ['lat' => $matches[1], 'lng' => $matches[2]];
        }
        
        return null;
    }
}
