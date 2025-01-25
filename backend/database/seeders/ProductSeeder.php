<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = [
            [
                'name' => 'Sample Product 1',
                'description' => 'Description for Sample Product 1.',
                'price' => 49.99,
                'image' => 'images/sample1.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 2',
                'description' => 'Description for Sample Product 2.',
                'price' => 99.99,
                'image' => 'images/sample2.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 3',
                'description' => 'Description for Sample Product 3.',
                'price' => 19.99,
                'image' => 'images/sample3.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 4',
                'description' => 'Description for Sample Product 4.',
                'price' => 29.99,
                'image' => 'images/sample4.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 5',
                'description' => 'Description for Sample Product 5.',
                'price' => 59.99,
                'image' => 'images/sample5.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 6',
                'description' => 'Description for Sample Product 6.',
                'price' => 39.99,
                'image' => 'images/sample6.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 7',
                'description' => 'Description for Sample Product 7.',
                'price' => 79.99,
                'image' => 'images/sample7.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 8',
                'description' => 'Description for Sample Product 8.',
                'price' => 89.99,
                'image' => 'images/sample8.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 9',
                'description' => 'Description for Sample Product 9.',
                'price' => 69.99,
                'image' => 'images/sample9.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sample Product 10',
                'description' => 'Description for Sample Product 10.',
                'price' => 109.99,
                'image' => 'images/sample10.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('products')->insert($products);
        
    }
}
