<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Api_key_requests extends Model
{
    protected $fillable = [
        'name', 'company_name', 'year', 'company_headquarters', 'what_company_does'
    ];
}
