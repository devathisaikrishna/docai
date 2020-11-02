<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan_services extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'plan_id', 'service_id'
    ];

    public function plan()
    {
        return $this->belongsTo('App\Models\Plan');
    }
}
