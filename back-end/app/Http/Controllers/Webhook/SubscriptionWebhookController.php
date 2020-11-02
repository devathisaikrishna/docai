<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User_plan;
use App\Traits\CommonMethod;
use App\Traits\UserPlanMethods;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class SubscriptionWebhookController extends Controller
{
    use UserPlanMethods;
    use CommonMethod;

    /**
     * use for handle webhook of all payment status like authenticate, capture and failed
     * everything keep in log file
     *
     * required: Raw data
     *
     * return Null;
     */
    public function subscription()
    {
        $json = file_get_contents('php://input');
        $webhookBody = json_decode($json);

        // put all webhookbody in log file
        Log::info(json_encode($webhookBody));

        if (!empty($webhookBody)) {
            $api = new Api(config('razorpay.key_id'), config('razorpay.key_Secret'));

            // try condition for verify singnature
            try {
                $webhookSignature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

                Log::info(json_encode($webhookSignature));

                // verify signature
                $api->utility->verifyWebhookSignature($json, $webhookSignature, config('razorpay.webhook_validate_key'));

                // subscription event
                if ($webhookBody->event === "subscription.activated") {
                    $this->subscription_activated($webhookBody);
                } elseif ($webhookBody->event === "subscription.charged") {
                    $this->subscription_charged($webhookBody);
                }
            } catch (SignatureVerificationError $e) {
                print_r($e->getMessage());
                Log::info($e->getMessage());
            }
        }
    }

    /**
     * use for activate user subscription in db
     * everything keep in log file
     *
     * required: Raw data
     *
     * return Null;
     */
    protected function subscription_activated($request)
    {

        $subscription = $request->payload->subscription->entity;

        // get subscription details
        $subs = Subscription::select(["id", "plan_id", "user_id", "billing_frequency", "status"])->with("plan")
            ->where("rz_subscription_id", $subscription->id)->first();

        if (empty($subs)) {
            echo $msg = $subscription->id . " Subscription id not found in database Method.subscription_activated";
            Log::info($msg);
            return false;
        }

        if ((int) $subs->status !== 1) {
            echo $msg = $subscription->id . " Subscription id dulicate request call for activate subscription Method.subscription_activated";
            Log::info($msg);
            return false;
        }

        // get plan details of current subscription
        $plan = $subs->plan;

        // update subscription details
        $this->update_subscription($subscription);

        // check payment capture of not using not empty
        if (!empty($request->payload->payment)) {

            // if payment capture then get payment details and according to plan allocate plan
            $payment = $request->payload->payment->entity;

            // store payment details
            $this->store_payment_details($payment, $subscription->id);

            $params = [
                'plan_id' => $plan->id,
                'user_id' => $subs->user_id,
                'duration' => $subs->billing_frequency,
                'allocation_type' => 1,
                'subscription_id' => $subs->id,
                'plan_start_at' => Carbon::createFromTimestamp($subscription->start_at),
                'plan_end_at' => Carbon::createFromTimestamp($subscription->charge_at),
            ];

            // archive current trial plan using set end date
            $User_plan = User_plan::select(["id"])
                ->where("user_id", $subs->user_id)->user_current_plan()->first();

            if (!empty($User_plan)) {
                // so updated plan start date is end date of current plan
                $User_plan->plan_end_at = Carbon::createFromTimestamp($subscription->start_at);
                $User_plan->save();
            }

            // allocate plan to user
            $user_plan_id = $this->allocate_plan($params);

            echo $msg = "Allocate plan to user " . $user_plan_id;
            Log::info($msg);
        }
    }

    /**
     * use for save subscription charged (payment details)
     * everything keep in log file
     *
     * required: Raw data
     *
     * return Null;
     */
    protected function subscription_charged($request)
    {
        $subscription = $request->payload->subscription->entity;

        // get subscription details
        $subs = Subscription::select(["id", "plan_id", "status"])->with("plan")
            ->where("rz_subscription_id", $subscription->id)->first();

        if (empty($subs)) {
            echo $msg = $subscription->id . " Subscription id not found in database Method.subscription_charged";
            Log::info($msg);
            return false;
        }

        if ((int) $subs->status !== 2) {
            echo $msg = $subscription->id . " Subscription id subscription not activate yet Method.subscription_charged";
            Log::info($msg);
            return false;
        }

        // if payment capture then get payment details and according to plan allocate plan
        $webhook_payment = $request->payload->payment->entity;

        $check_payment = Payment::where("rz_transaction_id", $webhook_payment->id)->first();

        if (!empty($check_payment)) {
            echo $msg = $webhook_payment->id . " Payment id not already stored in database Method.subscription_charged";
            Log::info($msg);
            return false;
        }

        // update subscription details
        $this->update_subscription($subscription);

        // store payment details
        $this->store_payment_details($webhook_payment, $subscription->id);

        // get user plan id for update plan
        $user_plan = User_plan::select("id")
            ->where("subscription_id", $subs->id)->first();

        // according to we have to update user plan
        $this->update_user_plan_one_cycle($user_plan->id, $subscription->current_end);
    }

    /**
     * use for update subscription details only
     *
     * @params $subscription
     *
     * return Null;
     */
    protected function update_subscription($subscription)
    {
        // updated subscription array
        $update_subscription = [
            "start_at" => Carbon::createFromTimestamp($subscription->start_at),
            "end_at" => Carbon::createFromTimestamp($subscription->end_at),
            "cycle_count" => $subscription->total_count,
            "paid_cycle_count" => $subscription->paid_count,
            "remaining_cycle_count" => $subscription->remaining_count,
            "status" => 2,
            "rz_response" => json_encode($subscription),
        ];

        // update subscription details
        Subscription::where("rz_subscription_id", $subscription->id)
            ->update($update_subscription);

        echo $msg = "update subscription details " . json_encode($update_subscription);
        Log::info($msg);
    }

    /**
     * use for store payment details of subscription charged
     *
     * @params $payment, $subscription_id
     *
     * return Null;
     */
    protected function store_payment_details($payment, $subscription_id)
    {
        // get subscription details
        $subs = Subscription::select(["id", "plan_id", "user_id", "billing_frequency"])->with("plan")
            ->where("rz_subscription_id", $subscription_id)->first();

        // get plan details of current subscription
        $plan = $subs->plan;
        $plan_amount = ((int) $subs->billing_frequency === 1) ? $plan->month_price : $plan->year_price;

        $sub_total = $plan_amount;
        $gst = $this->calculate_GST($sub_total);
        $total = $sub_total + $gst;

        // for prevent duplicate data insert of payment
        $prd = Payment::firstOrNew(['rz_transaction_id' => $payment->id]);

        $prd->rz_transaction_id = $payment->id;
        $prd->subscription_id = $subs->id;
        $prd->user_id = $subs->user_id;
        $prd->plan_amount = $plan_amount;
        $prd->sub_total = $sub_total;
        $prd->gst = $gst;
        $prd->total = $total;
        $prd->rz_capture_amount = (((float) $payment->amount) / 100); // devide by 100 convert in rupees

        $prd->card = json_encode($payment->card);
        $prd->payment_type = 2;
        $prd->payment_status = 2;
        $prd->rz_response_msg = $payment->description;
        $prd->payment_date = Carbon::createFromTimestamp($payment->created_at);
        $prd->rz_response = json_encode($payment);

        $prd->save();
    }
}
