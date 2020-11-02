<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Traits\CommonMethod;

class Plan extends Model
{
    use HasFactory;

    use CommonMethod;

    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'num_of_hit', 'plan_type', 'trial_duration', 'year_price', 'month_price', 'status' => 2
    ];

    /*
     * for relation between plan and many services
     *
     */
    public function services()
    {
        return $this->hasMany('App\Models\Plan_services');
    }

    /**
     * Get the subscriptions with curresponding plan id.
     */
    public function subscriptions()
    {
        return $this->hasMany('App\Models\Subscription');
    }

    /*
     * for get status of plan label
     *
     * @parmas $query
     *
     */
    public function scopeStatus_label($query)
    {
        return $query->addSelect(DB::raw('(CASE when status = 1 THEN "Active" when status = 2 THEN "Inactive" else "" end) as status_label'));
    }

    protected function rz_plan($plan, $plan_frequency)
    {
        $price = (float) ($plan_frequency === "monthly" ? $plan->month_price : $plan->year_price);

        $gst = $this->calculate_GST($price);
        $total = $price + $gst;

        return [
            "period" => $plan_frequency,
            "interval" => 1,
            "item" => [
                "name" => $plan->name,
                "amount" => ((float) $total * 100), // 100 * convert in pese
                "currency" => "INR",
                "description" => "Number of Api Hit - $plan->num_of_hit"
            ]
        ];
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::created(function ($plan) {
            if ($plan->plan_type === 1) {
                $plan_monthly = $plan->rz_plan($plan, 'monthly');
                $plan_yearly = $plan->rz_plan($plan, 'yearly');

                $rz_month = $plan->update_plan_on_razorpay($plan_monthly, $plan->id);
                $rz_year = $plan->update_plan_on_razorpay($plan_yearly, $plan->id);

                if ($rz_month["status"] === 200 && $rz_month["status"] === 200) {
                    $updated = [
                        "rz_month_plan_id" => $rz_month["rz_id"],
                        "rz_year_plan_id" => $rz_year["rz_id"],
                        "status" => 1
                    ];

                    $plan::where('id', $plan->id)->update($updated);
                }
            }else{
                $plan::where('id', $plan->id)->update(["status" => 1]);
            }
        });
    }

    protected function update_plan_on_razorpay($plan_details, $plan_id)
    {
        $response = Http::withBasicAuth(config('razorpay.key_id'), config('razorpay.key_Secret'))
            ->post('https://api.razorpay.com/v1/plans', $plan_details);

        if ($response->status() === 200) {
            $res = json_decode($response->body());
            // add log success
            Log::info(['res' => $response->body(), 'plan_id' => $plan_id, 'request' => $plan_details]);
            return ['rz_id' => $res->id, 'status' => 200];
        } else {
            $res = json_decode($response->body());
            // add log error
            Log::error(['res' => $response->body(), 'plan_id' => $plan_id, 'request' => $plan_details]);
            return ['rz_id' => $res->error, 'status' => 400];
        }
    }
}
