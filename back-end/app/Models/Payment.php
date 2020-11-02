<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\Subscription;
use App\Models\User;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'rz_order_id',
        'rz_transaction_id',
        'subscription_id',
        'user_id',
        'plan_amount',
        'coupon_id',
        'discount_amount',
        'coupon_name',
        'sub_total',
        'gst',
        'cart',
        'card',
        'total',
        'rz_capture_amount',
        'payment_type',
        'comment_note',
        'payment_status',
        'rz_response_msg',
        'payment_date',
        'rz_response',
    ];

    /*
     * for get payment status of plan label
     * 
     * @parmas $query
     * 
     */
    public function scopePaymentstatus_label($query)
    {
        return $query->addSelect(DB::raw('(CASE when payment_status = 1 THEN "Pending" when payment_status = 2 THEN "Success" when payment_status = 3 THEN "Refunded" when payment_status = 4 THEN "Failed" else "" end) as payment_status_label'));
    }

    /*
     * for get payment type of plan label
     * 
     * @parmas $query
     * 
     */
    public function scopePaymenttype_label($query)
    {
        return $query->addSelect(DB::raw('(CASE when payment_type = 1 THEN "Credit" when payment_type = 2 THEN "Debit" else "" end) as payment_type_label'));
    }


    /**
     * Get the subscription of as per subscription id.
     * 
     */
    public function subscription()
    {
        return $this->belongsTo('App\Models\Subscription');
    }
}
