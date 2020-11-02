<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User_plan;
use App\Rules\Plan_id;
use App\Traits\CommonMethod;
use App\Traits\UserPlanMethods;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Validator;

class UserPlanController extends Controller
{
    use UserPlanMethods;
    use CommonMethod;

    public function get_current_plan(Request $request)
    {
        $user = $request->user();

        // get user current plan
        $User_plan = User_plan::select(["plan_name", "num_of_hit", "remaining_hit", "plan_start_at", "plan_end_at", "plan_id"])
            ->where("user_id", $user->id)->user_current_plan()->duration_label()->first();

        // get subscription details
        $subscription = Subscription::select([
            "subscriptions.id as subscription_id",
            "subscriptions.plan_id",
            "subscriptions.start_at",
            "subscriptions.billing_frequency",
            "subscriptions.status",
            "subscriptions.remaining_cycle_count",
            "p.name as plan_name",
            "subscriptions.rz_subscription_link",
            DB::raw("(CASE when subscriptions.billing_frequency = 1 THEN month_price else year_price end) as recurring_amount"),
        ])
            ->join('plans as p', 'p.id', '=', 'subscriptions.plan_id')
            ->status_label()
            ->where(['subscriptions.user_id' => $user->id])
            ->whereIn('subscriptions.status', [1, 2])->first();


        if (!empty($subscription)) {
            $gst = $this->calculate_GST($subscription->recurring_amount);
            $subscription->recurring_amount = (float) $subscription->recurring_amount + $gst;

            if ((int) $subscription->status === 2) {
                // Next Payment Date
                $nextPaymentDate = Payment::select('payment_date')
                    ->where(['user_id' => $user->id, 'subscription_id' => $subscription->subscription_id])
                    ->first();

                if ($subscription->billing_frequency == 1) {
                    $nextPaymentDate['payment_date'] = Carbon::parse($nextPaymentDate['payment_date'])->addMonth()->format('d/m/Y');
                } else {
                    $nextPaymentDate['payment_date'] = Carbon::parse($nextPaymentDate['payment_date'])->addYear()->format('d/m/Y');
                }

                // Next Payment Amount
                $nextpayment = Plan::select([($subscription->billing_frequency == 1) ? "month_price as amount" : "year_price as amount"])
                    ->where("id", $subscription->plan_id)->first();

                $gst = $this->calculate_GST($nextpayment->amount);

                $nextpayment->amount = ((float) $nextpayment->amount) + $gst;

                $nx_payment = ["nextPaymentDate" => $nextPaymentDate->payment_date, "total" => $nextpayment->amount];
            }

            $payments = DB::table('payments as p')
            ->join('subscriptions as s', 's.id', '=', 'p.subscription_id')
            ->select([
                'p._payment_id as payment_id',
                'p.payment_date',
                'p.plan_amount',
                'p.coupon_name',
                'p.discount_amount',
                'p.sub_total',
                'p.gst',
                'p.total',
                'p.payment_type'
            ])
            ->where(['p.user_id' => $user->id, 'p.subscription_id' => $subscription->subscription_id])
            ->get();

            unset($subscription->subscription_id);
            unset($subscription->plan_id);
        }
        $res = [
            'current_plan' => $User_plan ?? ["no_plan" => true],
            'subscription' => $subscription ?? ["no_subscription" => true],
            'next_payment' => $nx_payment ?? [],
            'payments'     => $payments ?? [],
        ];

        return response()->json($res, 200);
    }

    public function get_user_payments(Request $request)
    {
        $user = $request->user();
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $columns = [
            '_payment_id as payment_id',
            'plan_amount',
            'total',
            'payment_type',
            DB::raw("DATE_FORMAT(payment_date, '%d/%m/%Y') as payment_date")
        ];

        // $subscription = Subscription::select('id')->where(['user_id' => $user->id, 'status' => 2])->first();

        $paginator =  Payment::select($columns)
            ->where('user_id', $user->id)
            ->where('subscription_id', function($query) use ($user) {
                $query->select('id')
                    ->from('subscriptions')
                    ->where(['user_id' => $user->id, 'status' => 2]);
            });

        if (!empty($request->sort_by)) {
            foreach ($request->sort_by as $val) {
                $paginator->orderBy($val['payment_id'], $val['desc'] ? "DESC" : "ASC");
            }
        }

        $paginator = $paginator->paymentstatus_label()->paginate($perPage, [], "PAGE", $pageNum);

        $result = collect($paginator);

        $res = [
            "data" => $result["data"] ?? [],
            "total" => $result["total"] ?? 0,
        ];

        return response()->json($res, 200);
    }

    public function update_plan(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'billing_frequency' => 'required',
            'change_type' => 'required',
            'plan_id' => ['required', new Plan_id],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        // get user subscription for plan Id
        $User_plan = Subscription::select(["p.id as plan_id", "subscriptions.id as subscription_id", "subscriptions.rz_subscription_id"])
            ->join('plans as p', 'p.id', '=', 'subscriptions.plan_id')
            ->where(["subscriptions.user_id" => $user->id, 'subscriptions.status' => 2])->first();

        if (empty($User_plan)) {
            return response()->json(["error" => "No current active plan found"], 400);
        }

        $plan_id = Crypt::decryptString($request->plan_id);

        $params = [
            "rz_subscription_id" => $User_plan->rz_subscription_id,
            "subscription_id" => $User_plan->subscription_id,
            "user_id" => $user->user_id,
            'billing_frequency' => $request->billing_frequency,
            'change_type' => $request->change_type,
            'plan_id' => $plan_id,
        ];

        $response = $this->update_subscription((object) $params);

        $rz_res = json_decode($response->body());

        if ($response->status() === 200) {

            // update current plan
            // set current plan end datetime at now and allocate updated plan
            $User_plan = User_plan::select(["id"])
                ->where("user_id", $user->id)->user_current_plan()->first();

            // so updated plan start date is end date of current plan
            $User_plan->plan_end_at = Carbon::createFromTimestamp($rz_res->start_at);
            $User_plan->save();

            $params = [
                'plan_id' => $plan_id,
                'user_id' => $user->id,
                'duration' => $request->billing_frequency,
                'allocation_type' => 1,
                'subscription_id' => $User_plan->subscription_id,
                'plan_start_at' => Carbon::createFromTimestamp($rz_res->start_at),
                'plan_end_at' => Carbon::createFromTimestamp($rz_res->end_at),
            ];

            // allocate updated plan to user
            $this->allocate_plan((object) $params);

            return response()->json(["message" => "Your plan updated successfully. Please wait some time to reflect your plan"]);
        } else {

            return response()->json(["error" => $rz_res->error->description], $response->status());
        }

    }

    protected function update_subscription($params)
    {
        $rz_plan_id = Plan::where('id', $params->plan_id)
            ->pluck(($params->billing_frequency == 1) ? "rz_month_plan_id" : "rz_year_plan_id")
            ->first();

        $subscription_details = [
            "plan_id" => $rz_plan_id,
            "quantity" => 1,
            "remaining_count" => 12,
            "schedule_change_at" => (((int) $params->change_type) === 1) ? "now" : "cycle_end",
            "customer_notify" => 1,
        ];

        $response = Http::withBasicAuth(config('razorpay.key_id'), config('razorpay.key_Secret'))
            ->patch('https://api.razorpay.com/v1/subscriptions/' . $params->rz_subscription_id, $subscription_details);

        if ($response->status() === 200) {

            // update data of success
            Subscription::where('id', $params->subscription_id)
                ->update([
                    "plan_id" => $params->plan_id,
                    "billing_frequency" => $params->billing_frequency,
                    "rz_response" => $response->body(),
                ]);
        }

        // add log
        Log::{$response->status() === 200 ? "info" : "error"}([
            'res' => $response->body(),
            'subscription_id' => $params->subscription_id,
            'request' => $subscription_details,
        ]);

        return $response;
    }
}
