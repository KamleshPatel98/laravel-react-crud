<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\BlogController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('blogs', BlogController::class);