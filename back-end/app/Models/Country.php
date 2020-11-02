<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    protected $table= "country";

    use SoftDeletes;

    protected $fillable = [
        'iso', 'name', 'nicename', 'iso3', 'numcode', 'phonecode'
    ];

    use HasFactory;
}
