<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription_billing_address extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'subscription_id', 'firstname', 'lastname', 'email', 'country', 'address', 'address_optional', 'state', 'city', 'pincode'
    ];

    /**
     * Get the subscription as per billing address
     */
    public function subscription()
    {
        return $this->belongsTo('App\Models\Subscription');
    }
}
