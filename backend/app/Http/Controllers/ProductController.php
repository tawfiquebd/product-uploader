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
                    ->latest('id')
                    ->get()
                    ->map(function ($product) {
                        return [
                            'name' => $product->name,
                            'description' => $product->description,
                            'price' => $product->price,
                            'image' => url('storage/' . $product->image), // Generate full URL
                        ];
                    });;

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
                'message' => 'Product not found!',
            ], Response::HTTP_NOT_FOUND);
        }
        return response()->json([
            'data' => $product,
            'message' => 'Data fetch successfully!',
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'required|image|max:2048',
        ]);

        $imagePath = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Product created successfully!',
            'data' => $product,
        ], Response::HTTP_CREATED);
    }

}
