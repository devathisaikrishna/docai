<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Traits\UserPlanMethods;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class PaymentWebhookController extends Controller
{
    use UserPlanMethods;

    /*
     * use for handle webhook of all payment status like authenticate, capture and failed
     * everything keep in log file
     *
     * required: Raw data
     *
     * return Null;
     */
    public function payment()
    {
        $json = file_get_contents('php://input');
        $webhookBody = json_decode($json);

        Log::info(json_encode($webhookBody));

        if (!empty($webhookBody)) {
            $api = new Api(config('razorpay.key_id'), config('razorpay.key_Secret'));

            try {
                $webhookSignature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

                Log::info(json_encode($webhookSignature));

                // verify signature
                $api->utility->verifyWebhookSignature($json, $webhookSignature, config('razorpay.webhook_validate_key'));

                // payment event
                if ($webhookBody->event === "payment.captured") {
                    $this->payment_capture($webhookBody);
                }
            } catch (SignatureVerificationError $e) {
                print_r($e->getMessage());
                Log::info($e->getMessage());
            }
        }
    }

    /*
     * use for handle webhook payment capture webhook
     * everything keep in log file
     *
     * functionaliy : update status, allocate plan
     *
     * required: Raw data
     *
     * return Null;
     */
    public function payment_capture($webhookBody)
    {

        // get main array from webhook body
        $payment_webhook = $webhookBody->payload->payment->entity;

        $payment = Payment::select(["cart", "user_id", "payment_status", "subscription_id"])
            ->where("rz_order_id", $payment_webhook->order_id)->first();


        if (empty($payment)) {
            echo $msg = "Not exist in database this order_id id " . $payment_webhook->id;
            Log::info($msg);
            return false;
        }

        //check payment status should be 1 as pending
        if ($payment->payment_status == 1) {
            $payment_update = [
                "card" => json_encode($payment_webhook->card ?? []),
                "payment_status" => 2,
                "rz_capture_amount" => (((float) $payment_webhook->amount) / 100), // devide by 100 convert in ruppes
                "payment_date" => Carbon::createFromTimestamp($payment_webhook->created_at),
                "rz_response" => json_encode($payment_webhook),
            ];

            Payment::where(["rz_order_id" => $payment_webhook->order_id])
                ->update($payment_update);

            $cart = json_decode($payment->cart);
            $plan = $cart->plan;

            $params = [
                'plan_id' => Crypt::decryptString($plan->plan_id),
                'user_id' => $payment->user_id,
                'duration' => $plan->billing_frequency,
                'allocation_type' => 1,
                'subscription_id' => $payment->subscription_id,
            ];

            // allocate plan to user with one month expire date
            $user_plan_id = $this->allocate_plan($params);

            echo $msg = $user_plan_id . " Allocated User Plan ID";
            Log::info($msg);
        } else {
            echo $msg = "Payment status already updated mean dupicate webhook call";
            Log::info($msg);
        }
    }
}
