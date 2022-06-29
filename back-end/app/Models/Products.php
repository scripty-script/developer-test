<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Products extends Model
{
    use HasFactory;
    

    protected $table = 'products';

    protected $hidden = ['category_id'];

    protected  $fillable =[
        'name',
        'description',
        'price',
        'qty',
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
