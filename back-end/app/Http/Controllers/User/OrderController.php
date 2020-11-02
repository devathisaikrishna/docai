<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Country;
use App\Models\Subscription;
use App\Models\Subscription_billing_address;
use Razorpay\Api\Api;
use Validator;
use Illuminate\Support\Facades\Crypt;
use App\Models\Plan;
use App\Models\Payment;
use App\Models\User;
use App\Rules\Plan_id;
use App\Traits\CartOrderMethod;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class OrderController extends Controller
{
    use CartOrderMethod;

    function get_all_country_option()
    {
        $Country = Country::select(["id", "name"])->get();

        return response()->json($Country, 200);
    }

    protected function validate_order(Request $request)
    {
        return Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email',
            'country' => 'required',
            'state' => 'required',
            'address' => 'required',
            'city' => 'required',
            'pincode' => 'required',
            'plan_id' => ['required', new Plan_id],
            'billing_frequency' => 'required',
        ]);
    }

    function order(Request $request)
    {
        $user = $request->user();

        $validator = $this->validate_order($request);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        // check any subscription already pending or activate
        $subscription = Subscription::select(["id"])
            ->where(['user_id' => $user->id])
            ->active_subscription()->first();

        // if (!empty($subscription)) {
            return response()->json(["error" => "User have already subscription"], 400);
        // }

        $plan_id = Crypt::decryptString($request->plan_id);

        $this->plan_id = $plan_id;
        $this->user_id = $user->id;
        $this->billing_frequency = $request->billing_frequency;

        $this->cart = $this->cart();

        // save subscription details
        $this->save_subcription_details($request);

        // push subscription on razor pay
        $subscription = $this->create_rz_subscription();
        $subs_response = json_decode($subscription->body());

        if ($subscription->status() !== 200) {
            return response()->json(["error" => "Your request has failed. Please try again after some time"], $subscription->status());
        }

        // save billing details of subscription
        $this->save_billing_details($request);

        $_subscription_id = Subscription::where('id', $this->subscription_id)
            ->pluck("_subscription_id")->first();

        return response()->json([
            "message" => "Your request save successfully. Please check your email and phone number for on recurring payment on",
            "subscription" => [
                "subscription_link" => $subs_response->short_url,
                "subcription_id" => $_subscription_id
            ],
        ], 200);
    }

    protected function save_subcription_details(Request $request)
    {
        // create object subscription
        $subscription = new Subscription();

        $subscription->user_id = $this->user_id;
        $subscription->plan_id = $this->plan_id;

        // according to billing frequecncy set default cycle
        $this->cycle_count = ($request->billing_frequency == 1) ?  config('razorpay.month_cycle') : config('razorpay.year_cycle');
        $subscription->cycle_count = $this->cycle_count;
        $subscription->billing_frequency = $request->billing_frequency;
        $subscription->status = 1;

        $subscription->save();
        $this->subscription_id = $subscription->id;

        return $this->subscription_id;
    }

    protected function save_billing_details(Request $request)
    {

        $Subscription_billing_address = new Subscription_billing_address();
        $Subscription_billing_address->subscription_id = $this->subscription_id;
        $Subscription_billing_address->firstname = $request->firstname;
        $Subscription_billing_address->lastname = $request->lastname;
        $Subscription_billing_address->email = $request->email;
        $Subscription_billing_address->country = $request->country;
        $Subscription_billing_address->address = $request->address;
        $Subscription_billing_address->address_optional = $request->address_optional ?? NULL;
        $Subscription_billing_address->state = $request->state;
        $Subscription_billing_address->city = $request->city;
        $Subscription_billing_address->pincode = $request->pincode;

        $Subscription_billing_address->save();
    }

    protected function create_rz_subscription()
    {
        $user = User::where(["id" => $this->user_id])->first();

        $start_date = false;

        $rz_plan_id = Plan::where('id', $this->plan_id)
            ->pluck(($this->billing_frequency == 1) ? "rz_month_plan_id" : "rz_year_plan_id")
            ->first();


        if ($this->coupon_applied) {
            $start_date = Carbon::now()->addMonth(1)->timestamp;
        }

        $subscription_details = [
            "plan_id" => $rz_plan_id,
            "total_count" => $this->cycle_count,
            "quantity" => 1,
            "expire_by" => Carbon::now()->addDays(7)->timestamp,
            "customer_notify" => 1,
            "notify_info" => [
                "notify_phone" => $user->phone,
                "notify_email" => $user->email
            ]
        ];

        if (!empty($start_date)) {
            $subscription_details["start_at"] = $start_date;
        }

        $response = Http::withBasicAuth(config('razorpay.key_id'), config('razorpay.key_Secret'))
            ->post('https://api.razorpay.com/v1/subscriptions', $subscription_details);

        $res = json_decode($response->body());

        if ($response->status() === 200) {

            // update data of success
            Subscription::where('id', $this->subscription_id)
                ->update(["rz_subscription_id" => $res->id, "rz_subscription_link" => $res->short_url, "rz_response" => $response->body()]);
        } else {

            // update data of failure
            Subscription::where('id', $this->subscription_id)
                ->update(["rz_response" => $response->body()]);
        }

        // add log
        Log::{$response->status() === 200 ? "info" : "error"}([
            'res' => $response->body(),
            'subscription_id' => $this->subscription_id,
            'request' => $subscription_details
        ]);

        return $response;
    }
}
