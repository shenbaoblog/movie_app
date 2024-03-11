<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($media_type, $media_id)
    {
        $reviews = Review::with('user')
        ->where('media_type', $media_type)
        ->where('media_id', $media_id)
        ->get();

        return response()->json($reviews);
    }
}
