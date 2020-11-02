<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'coupon_code',
        'coupon_type',
        'amount',
        'percentage',
        'discount_up_to',
        'minimum_purchase_amount',
        'number_of_per_person_use',
        'number_of_uses',
        'remaining_uses',
        'start_at',
        'end_at',
        'description',
        'admin_id',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
