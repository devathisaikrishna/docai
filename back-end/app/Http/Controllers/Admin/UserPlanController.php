<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\Payment;
use Validator;
use Carbon\Carbon;
use App\Traits\CommonMethod;
use App\Traits\UserPlanMethods;
use Illuminate\Support\Facades\Http;

class UserPlanController extends Controller
{
    use CommonMethod;
    use UserPlanMethods;

    function allocate_plan_to_user(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required',
            'user_id' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $param = [
            'plan_id' => $request->plan_id,
            'user_id' => $request->user_id,
            'duration' => '0',
            'allocation_type' => 2
        ];

        // allocate plan to user
        $User_plan_id = $this->allocate_plan($param);

        return response()->json(["message" => "Plan allocated successfully"], 200);
    }

    /**
     * get_user_plan_subscription_listing() for user subscription plan listing
     * @param $requset parameter
     */

    public function get_user_plan_subscription_listing(Request $request){

        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $search_column = [
            "id",
            "_subscription_id",
            DB::raw("(select concat_ws(' ',firstname, lastname) from users where id=subscriptions.user_id)"),
            DB::raw("(SELECT name FROM plans where id=subscriptions.plan_id)"),
            DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y')"),
        ];
        $columns = [
            "id",
            "_subscription_id",
            DB::raw("(select concat_ws(' ',firstname, lastname) from users where id=subscriptions.user_id) as user_name"),
            DB::raw("(SELECT name FROM plans where id=subscriptions.plan_id) as plan_name"),
            DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y') as created")
        ];

        $paginator = Subscription::select($columns)->status_label()->billing_frequency_label();


        if (!empty($request->sort_by)) {
            foreach ($request->sort_by as $val) {
                $paginator->orderBy($val['id'], $val['desc'] ? "DESC" : "ASC");
            }
        }else{
            $paginator->orderBy('id','desc');
        }

        if (!empty($request->search)) {
            $paginator->where(function ($query) use ($search_column, $request) {
                foreach ($search_column as $column) {
                    $query->orWhere($column, "LIKE", "%$request->search%");
                }
            });
        }

        $paginator = $paginator->paginate($perPage, [], "PAGE", $pageNum);
        $result = collect($paginator);
        $res = [
            "data" => $result["data"] ?? [],
            "total" => $result["total"] ?? 0
        ];

        return response()->json($res, 200);

    }

    /**
     * get_user_plan_subscription() for fetch user subscription plan data
     * @param id int
     */
    public function get_user_plan_subscription(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'page_Size' => 'required',
            'start' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $result = Subscription::select()->with('plan', 'user')->status_label()->billing_frequency_label()->where('id', $request->id)->first();
        if(empty($result)){
            return response()->json(["message"=>"Data not found."],204);
        }else{
            $res = $result->toArray();
            /** code for payment list */

            $perPage = $request->page_size ?? 10;
            $start = request()->get('start', 0);
            $pageNum = ceil($start / $perPage) + 1;

            $search_column = [
                "id",
                "_payment_id",
                "rz_transaction_id",
                "total",
                "payment_type",
                "payment_status",
                DB::raw("DATE_FORMAT(payment_date, '%d/%m/%Y')")
            ];

            $columns = [
                "id",
                "_payment_id",
                "rz_transaction_id",
                "total",
                "payment_type",
                "payment_status",
                DB::raw("DATE_FORMAT(payment_date, '%d/%m/%Y') as paymentdate")];

            $paginator = Payment::select($columns)->paymenttype_label()->paymentstatus_label()->where("subscription_id", $res["id"])->where('user_id', $res["user_id"]);


            if (!empty($request->sort_by)) {
                foreach ($request->sort_by as $val) {
                    $paginator->orderBy($val['id'], $val['desc'] ? "DESC" : "ASC");
                }
            }else{
                $paginator->orderBy('id','desc');
            }

            if (!empty($request->search)) {
                $paginator->where(function ($query) use ($search_column, $request) {
                    foreach ($search_column as $column) {
                        $query->orWhere($column, "LIKE", "%$request->search%");
                    }
                });
            }

            $paginator = $paginator->paginate($perPage, [], "PAGE", $pageNum);;

            $result = collect($paginator);

            return response()->json([
                "id" => $res["id"],
                "_subscription_id" => $res["_subscription_id"],
                "user_id" => $res["user_id"],
                "paid_cycle_count" => $res["paid_cycle_count"],
                "remaining_cycle_count" => $res["remaining_cycle_count"],
                "cycle_count" => $res["cycle_count"],
                "rz_subscription_id" => $res["rz_subscription_id"],
                "plan_id" => $res["plan_id"],
                "start_at" => $res["start_at"]!=null?Carbon::parse($res["start_at"])->format('d-m-Y h:i A'):null,
                "end_at" => $res["end_at"]!=null?Carbon::parse($res["end_at"])->format('d-m-Y h:i A'):null,
                "created_at" => $res["created_at"]!=null?Carbon::parse($res["created_at"])->format('d-m-Y h:i A'):null,
                "cancel_at" => $res["cancel_at"]!=null?Carbon::parse($res["cancel_at"])->format('d-m-Y h:i A'):null,
                "billing_frequency" => $res["billing_frequency"],
                "cycle_count" => $res["cycle_count"],
                "status" => $res["status"],
                "status_label" => $res["status_label"],
                "billing_frequency_label" => $res["billing_frequency_label"],
                "plan_name" => $res["plan"]["name"],
                "user_firstname" => $res["user"]["firstname"],
                "user_lastname" => $res["user"]["lastname"],
                "user_email" => $res["user"]["email"],
                "user_phone" => $res["user"]["phone"],
                "data" => isset($result["data"])?$result["data"]:[],
                "total" => isset($result["total"])?$result["total"]:0
            ],200);
        }

    }

    /**
     * get_user_plan_subscription_payment_detail() for subscription payment detail
     */

    public function get_user_plan_subscription_payment_detail(Request $request){
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $columns = [
            "id",
            "_payment_id",
            "rz_transaction_id",
            "subscription_id",
            "plan_amount",
            "plan_amount",
            "discount_amount",
            "coupon_name",
            "sub_total",
            "gst",
            "total",
            "card",
            "comment_note",
            DB::raw("DATE_FORMAT(payment_date, '%d-%m-%Y %h:%i %p') as paymentdate"),
            "_payment_id"];
        $result = Payment::select($columns)->paymenttype_label()->paymentstatus_label()->with('subscription')->where("id", $request->payment_id)->first();

        if(empty($result)){
            return response()->json(["message"=>"Data not found."],204);
        }else{
            $response_data = $result->toArray();
            return response()->json([
                "id" => $response_data["id"],
                "payment_id" => $response_data["_payment_id"],
                "rz_transaction_id" => $response_data["rz_transaction_id"],
                "subscription_id" => $response_data["subscription_id"],
                "plan_amount" => $response_data["plan_amount"],
                "discount_amount" => $response_data["discount_amount"],
                "coupon_name" => $response_data["coupon_name"],
                "sub_total" => $response_data["sub_total"],
                "gst" => $response_data["gst"],
                "total" => $response_data["total"],
                "card" => $response_data["card"],
                "comment_note" => $response_data["comment_note"],
                "paymentdate" => $response_data["paymentdate"],
                "payment_type_label" => $response_data["payment_type_label"],
                "payment_status_label"=> $response_data["payment_status_label"],
                "subscription_id_v" => $response_data["subscription"]["_subscription_id"],
            ],200);
        }

    }

    /**
     * cancel_subscription_plan() cancel user subscription plan
     * @param subscription_id integer
     * @param option integer 1 or 2
     */
    public function cancel_subscription_plan(Request $request){
        $validator = Validator::make($request->all(), [
            'subscription_id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }
        $subscription = Subscription::find($request->subscription_id);
        if(empty($subscription)){
            return response()->json(["error"=>"Data not found."],400);
        }else{
            $result = $subscription->toArray();

            $rz_subscription_id = $result["rz_subscription_id"];
            $rz_option_data["cancel_at_cycle_end"] = 1;
            $response = Http::withBasicAuth(config('razorpay.key_id'), config('razorpay.key_Secret'))
            ->post('https://api.razorpay.com/v1/subscriptions/'.$rz_subscription_id.'/cancel', $rz_option_data);

            $res = json_decode($response->body());
            if ($response->status() === 200) {
                $subscription->status = 5;
                $subscription->rz_cancel_response = $response->body();
                $subscription->cancel_at = Carbon::now();
                $subscription->save();
                return response()->json(["success"=>"Plan subscription has been successfully cancelled."], 200);
            }else{
                return response()->json($res->error,$response->status());
            }
        }
    }

}
