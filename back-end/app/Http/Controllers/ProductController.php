<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'stocks');
        $q = $request->query('q');

        if(!empty($q)){
            if($filter === 'no-stock'){
               
                return response()->json(
                    Products::with('category')
                    ->where([
                        ['qty', '<=', 0], 
                        ['isDeleted', false],
                        ['name', 'like', '%'.$q.'%']
                    ])
                    ->orWhere('description', 'like', '%'.$q.'%')
                    ->orWhere('price', 'like', '%'.$q.'%')
                    ->orWhere('qty', 'like', '%'.$q.'%')
                    ->get()
                );
            }
    
            return response()->json(
                    Products::with('category')
                    ->where([
                        ['isDeleted', false],
                        ['name', 'like', '%'.$q.'%']
                    ])
                    ->orWhere('description', 'like', '%'.$q.'%')
                    ->orWhere('price', 'like', '%'.$q.'%')
                    ->orWhere('qty', 'like', '%'.$q.'%')
                    ->get()
            );
        }

        if($filter === 'no-stock'){
            return response()->json(
                Products::with('category')
                ->where([
                    ['qty', '<=', 0], 
                    ['isDeleted', false]
                ])->get()
            );
        }

        return response()->json(Products::with('category')->where('isDeleted', false)->get());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|Numeric',
            'qty' => 'required|int',
            'category_id' => 'required|int',
        ]);

        if ($validator->fails()) {
            return response()->json([ 'message' => $validator->errors()->all()], 400);
        }

        $validated = $validator->validated();

        $product = new Products([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'qty' => $validated['qty'],
            'category_id' => $validated['category_id'],
        ]);

        $product->save();
        //$product = Products::find($product->id)->with('category')->get();
        return response()->json(['message'=>'Product has been added!', 'data'=>$product->load('category')], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
       
        $product =  Products::with('category')
                        ->where([
                            ['id', '=', $id], 
                            ['isDeleted', false],
                        ])->first();

        //check if null
        if ($product == null){
            return  response()->json([ 'message' => 'No product found'], 404);
        }

        return response()->json( $product, 201);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Products::find($id);

        //check if null
        if ($product == null){
            return  response()->json([ 'message' => 'No product found'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|Numeric',
            'qty' => 'required|int',
            'category_id' => 'required|int',
        ]);

        if ($validator->fails()) {
            return response()->json([ 'message' => $validator->errors()->all()], 400);
        }

        $validated = $validator->validated();
        $product->name =  $validated['name'];
        $product->description =  $validated['description'];
        $product->price =  $validated['price'];
        $product->qty =  $validated['qty'];
        $product->category_id = $validated['category_id'];

        $product->save();
        return response()->json(['message'=>'Product has been updated!', 'data'=>$product->load('category')], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $product = Products::find($id);

        //check if null
        if ($product == null){
            return  response()->json([ 'message' => 'No product found'], 404);
        }

        $product->isDeleted = true;
        $product->save();

        return response()->noContent();
    }
}
