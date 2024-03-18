<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'content' => 'required|string',
            'rating' => 'required|integer',
            'media_type' => 'required|string',
            'media_id' => 'required|integer',
        ]);

        // $review = $request->input("content");
        $review = Review::create(
            [
                'user_id' => Auth::id(),
                'content' => $validatedData['content'],
                'rating' => $validatedData['rating'],
                'media_type' => $validatedData['media_type'],
                'media_id' => $validatedData['media_id'],
            ]);

        $review->load('user'); // 1つのレビューが特定のユーザーに属している場合、userという関連が定義されていれば、$review->load('user')を使ってそのユーザーの情報をレビューと一緒に読み込むことができます。
        return response()->json($review);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return response()->json(["message" => "正常にレビューを削除しました。" , 204]);
    }
}
