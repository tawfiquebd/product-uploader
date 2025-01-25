<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    // Fetch all products
    public function index()
    {
        $products = Product::query()
                    ->latest()
                    ->get();

        return response()->json([
            'data' => $products,
            'message' => 'Data fetch successfully!',
        ], Response::HTTP_OK);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'data' => [],
                'message' => 'Product not foun!',
            ], Response::HTTP_NOT_FOUND);
        }
        return response()->json([
            'data' => $product,
            'message' => 'Data fetch successfully!',
        ], Response::HTTP_OK);
    }
}
