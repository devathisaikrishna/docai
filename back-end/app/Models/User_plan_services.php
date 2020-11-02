<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_plan_services extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_plan_id', 'service_id'
    ];
}
