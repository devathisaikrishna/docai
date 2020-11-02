<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Subscription extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = [
        'user_id', 'plan_id', 'cycle_count', 'billing_frequency', 'status', 'rz_subscription_link'
    ];

    /*
     * for get activate or pending (status 1, 2) subscription of user
     *
     * @parmas $query
     *
     */
    public function scopeActive_subscription($query)
    {
        return $query->whereIn("subscriptions.status", [1, 2]);
    }

    /*
     * for get status of subscriptions label
     *
     * @parmas $query
     *
     */
    public function scopeStatus_label($query)
    {
        return $query->addSelect(DB::raw("(CASE when subscriptions.status = 1 THEN 'Pending' when subscriptions.status = 2 THEN 'Activate' when subscriptions.status = 3 THEN 'Completed' when subscriptions.status = 4 THEN 'Expired' when subscriptions.status = 5 THEN 'Cancelled' else '' end) as status_label"));
    }

    /*
     * for get billing_frequency of subscriptions label
     *
     * @parmas $query
     *
     */
    public function scopeBilling_frequency_label($query)
    {
        return $query->addSelect(DB::raw("(CASE when subscriptions.billing_frequency = 1 THEN 'Monthly' when subscriptions.billing_frequency = 2 THEN 'Yearly' else '' end) as billing_frequency_label"));
    }

    /**
     * Get the plan of as per subscription id.
     */
    public function plan()
    {
        return $this->belongsTo('App\Models\Plan');
    }
    /**
     * Get the user of as per subscription id.
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    /**
     * Get the payments for the subscription.
     */
    public function payments()
    {
        return $this->hasMany('App\Models\Payment');
    }

    /**
     * Get the subscription billing address which associated.
     */
    public function billing_address()
    {
        return $this->hasOne('App\Models\Phone');
    }

    public function create_rz_subscription($request, $user_id)
    {
        $user = User::where(["id" => $user_id])->first();

        $subscription_details = [
            "plan_id" => $request->plan_id,
            "total_count" => $request->cycle_count,
            "quantity" => 1,
            // "start_at" => Carbon::now()->timestamp,
            "expire_by" => Carbon::now()->addDays(7)->timestamp,
            "customer_notify" => 1,
            "notify_info" => [
                "notify_phone" => $user->phone,
                "notify_email" => $user->email,
            ],
        ];

        $response = Http::withBasicAuth(config('razorpay.key_id'), config('razorpay.key_Secret'))
            ->post('https://api.razorpay.com/v1/subscriptions', $subscription_details);

        $res = json_decode($response->body());

        if ($response->status() === 200) {

            // update data of success
            DB::table('subscriptions')
                ->where('id', $request->subscription_id)
                ->update(["rz_subscription_id" => $res->id, "rz_response" => $response->body()]);
        } else {

            // update data of failure
            DB::table('subscriptions')
                ->where('id', $request->subscription_id)
                ->update(["rz_response" => $response->body()]);
        }

        // add log
        Log::{$response->status() === 200 ? "info" : "error"}([
            'res' => $response->body(),
            'subscription_id' => $request->subscription_id,
            'request' => $subscription_details,
        ]);

        return $response;
    }

}
