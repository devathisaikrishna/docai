<?php

namespace App\Traits;

use App\Models\Coupon;
use App\Models\Payment;
use App\Models\Plan;
use App\Traits\CommonMethod;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

trait CartOrderMethod
{

    use CommonMethod;

    // use coupon code
    protected $coupon_code;

    // current user login id
    protected $user_id = false;

    // cart data of cart method array (exist method in CartController)
    protected $cart = [];

    // use for subscription id
    protected $subscription_id;

    // descrypted plan id
    protected $plan_id;

    // billing frequncy (1 - Monthly/ 2 - Yearly)
    protected $billing_frequency;

    // set default initial cycle count
    protected $cycle_count;

    // on this order coupon applied
    protected $coupon_applied = false;

    // rz order id
    protected $rz_order_id = false;

    /*
     * use for calculation of cart and make cart array  (like sub_total, gst and total)
     *
     * required
     *  set $plan_id, $billing_frequency
     *
     * @$params $other
     * @$other = [
     *    "coupon" => [
     *           "coupon_code" => "NEW50",
     *           "discount_amount" => 20
     *       ]
     *
     * return type array
     * return [
     *      "cart" => [],
     *      "sub_total" => 100,
     *      "gst" => 10,
     *      "total" => 110,
     *    ]
     */
    protected function cart($other = [])
    {
        $plan = Plan::select([($this->billing_frequency == 1 ? "month_price as price" : "year_price as price"), "name", "num_of_hit"])
            ->where(["id" => $this->plan_id])->first();

        $pl = $plan->toArray();
        $pl["desc"] = "Api Hit - " . $pl["num_of_hit"];
        $pl["plan_id"] = Crypt::encryptString($this->plan_id);
        $pl["billing_frequency"] = $this->billing_frequency;

        $cr['plan'] = $pl;

        $cr["sub_total"] = $pl["price"];
        $sub_total = $cr["sub_total"];

        if (!empty($other['coupon'])) {
            $coupon = $other['coupon'];
            $cr["coupon"] = $coupon;

            $sub_total = $sub_total - $coupon["discount_amount"];
        }

        $cr["gst"] = $this->calculate_GST($sub_total);
        $cr["total"] = $sub_total + $cr["gst"];

        return $cr;
    }

    /*
     * use to validate coupan code
     *
     * required
     * set $coupon_code
     *     $user_id
     *     $cart
     *
     * return type array
     * return ["status" => true, "redeem_amount" => $redeem_amount] / return ["status" => false, "error" => "Coupon code is not valid"];
     *
     */

    protected function validate_coupon()
    {
        $coupon_code = $this->coupon_code;
        $user_id = $this->user_id;
        $cart = $this->cart;

        // get coupon details
        $coupon = Coupon::where("coupon_code", $coupon_code)->first();

        // if empty data mean invalid coupon
        if (!$coupon) {
            return ["status" => false, "error" => "Invalid coupon"];
        }
        // print_r($coupon);

        $current_timestamp = strtotime(date("Y-m-d"));
        $start_date = strtotime($coupon->start_at);
        $end_date = strtotime($coupon->end_at);

        // coupon code started or not
        if ($start_date > $current_timestamp) {
            return ["status" => false, "error" => "Coupon code is not valid"];
        }

        // coupone code is expired
        if ($current_timestamp > $end_date) {
            return ["status" => false, "error" => "Coupon is expired"];
        }

        // remaining uses should greather than if not then show error
        if ($coupon->remaining_uses <= 0) {
            return ["status" => false, "error" => "Coupon usage limit has been reached"];
        }

        // cart subtotal should be Greater than expacted minimum purchase amount
        if ($coupon->minimum_purchase_amount > $cart["sub_total"]) {
            return ["status" => false, "error" => "Cart total must be " . config('razorpay.currency_sign') . "$coupon->minimum_purchase_amount total to redeem this code."];
        }

        $coupon_usage = Payment::select(DB::raw("count(id) as uses"))
            ->where(["user_id" => $user_id, 'coupon_id' => $coupon->id, "payment_status" => 2])
            ->first();

        // As per user check limit usage of coupon code
        if ($coupon_usage->uses >= $coupon->number_of_per_person_use) {
            return ["status" => false, "error" => "Your coupon usage limit has been reached"];
        }

        // finding amount of actual will deducted
        if ($coupon->percantage == 2) {
            $x = ((float) $cart["sub_total"] * (float) $coupon->percantage) / 100;

            $redeem_amount = ($x > (float) $coupon->discount_up_to) ? $coupon->discount_up_to : $x;
        } else {
            $redeem_amount = (float) $coupon->amount;
        }

        return ["status" => true, "redeem_amount" => $redeem_amount, "coupon_id" => $coupon->id];
    }
}
