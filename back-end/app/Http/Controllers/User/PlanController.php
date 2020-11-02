<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Plan_services;
use App\Models\Service;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PlanController extends Controller
{
    /*
     * show plan listing to user can purchase plan
     *
     * @$request
     *
     * return type json
     * return $plans
     */
    public function get_all_plans(Request $request)
    {
        $user = $request->user();

        // get user subscription for plan Id
        $User_plan = Subscription::select(["p._plan_id", "subscriptions.status"])
            ->join('plans as p', 'p.id', '=', 'subscriptions.plan_id')
            ->active_subscription()
            ->first();

        $_current_plan_id = 0;
        $any_active_plan = false;
        $subscription_pending = false;
        if (!empty($User_plan)) {
            if((int) $User_plan->status === 1){
                $subscription_pending = true;
            }

            if ((int) $User_plan->status === 2) {
                $_current_plan_id = $User_plan->_plan_id;
                $any_active_plan = true;
            }
        }

        // only paid plan for sell
        $all_plan = Plan::select(["id", "_plan_id", "name", "month_price", "year_price", "num_of_hit", "slug"])
            ->where(['plan_type' => 1, 'status' => 1])->with("services")->get();

        $plans = $all_plan->toArray();

        $services = Service::select(["name", "id"])->where("is_service", 1)->get();

        if (!empty($plans)) {
            foreach ($plans as $index => $val) {
                $plan_services = array_column($val['services'], 'service_id');

                $s = $services;
                if (!empty($s)) {
                    foreach ($s as $s_index => $s_val) {
                        $s[$s_index]["access"] = in_array($s_val->id, $plan_services) ? true : false;
                    }
                }

                $plans[$index]["plan_id"] = Crypt::encryptString($plans[$index]["id"]);
                unset($plans[$index]["id"]);
                $plans[$index]["services"] = $s;
            }
        }

        return response()->json([
            "plans" => $plans,
            "_current_plan_id" => $_current_plan_id,
            "any_active_plan" => $any_active_plan,
            "subscription_pending" => $subscription_pending,
        ], 200);
    }

    protected function get_plan_services($plan_ids)
    {
        $plan_services = Plan_services::select(["service_id", "plan_id"])
            ->whereIn("plan_id", $plan_ids)
            ->get();

        $p_ser = $plan_services->toArray();

        $res = [];
        if (!empty($p_ser)) {
            foreach ($p_ser as $val) {

                $res[$val["plan_id"]][] = $val["service_id"];
            }
        }

        return $res;
    }
}
