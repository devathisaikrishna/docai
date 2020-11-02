<?php

namespace App\Traits;

use App\Models\User_plan;
use App\Models\User_plan_services;
use App\Models\Plan;
use Carbon\Carbon;


trait UserPlanMethods
{

    /*
     * input params
     *
     * @$params = [
     *      'plan_id' => $plan_id,
     *      'user_id' => $user_id,
     *      'duration' => $duration
     *      'allocation_type' => $allocation_type, 	1 - user purchase/ 2 - By admin
     *      'subscription_id' => $subscription_id // is optional
     *      'plan_start_at' => $start_at, // is optional
            'plan_end_at' => $end_at, // is optional
     *  ]
     *
     * return type id
     * return user_plans.user_plan_id
     */
    function allocate_plan($params)
    {
        // anything to object
        $params = (object) $params;

        // get plan details
        $plan = Plan::where('id', $params->plan_id)->first();

        if (!empty($plan)) {

            $User_plan = new User_plan();

            $User_plan->user_id = $params->user_id;
            $User_plan->subscription_id = $params->subscription_id ?? null;
            $User_plan->plan_name = $plan->name;
            $User_plan->plan_id = $params->plan_id;
            $User_plan->num_of_hit = $plan->num_of_hit;
            $User_plan->plan_type = $plan->plan_type;
            $User_plan->duration = $params->duration; // plan duration which selected monthly or yearly
            $User_plan->remaining_hit = $plan->num_of_hit;

            $duration_days = 0;
            $price = 0;
            if ($plan->plan_type == 1) {
                $duration_days = $params->duration == 1 ? 30 : 364;
                $price = $plan->month_price;
            } else if ($plan->plan_type == 2) {
                $duration_days = (int) $plan->trial_duration;
                $price = $plan->year_price;
            }

            // if already params come for plan start and end date then here using it
            $plan_start_at = $params->plan_start_at ?? Carbon::now();
            $plan_end_at = $params->plan_end_at ?? Carbon::now()->addDays((int) $duration_days);

            $User_plan->duration_days = $duration_days;
            $User_plan->plan_start_at = $plan_start_at;
            $User_plan->plan_end_at = $plan_end_at;
            $User_plan->allocation_type = $params->allocation_type;
            $User_plan->price = $price;
            $User_plan->save();
            $user_plan_id = $User_plan->id;

            $us_plan_ser = [];
            if (!empty($plan->services)) {
                foreach ($plan->services as $val) {
                    $x["user_plan_id"] = $user_plan_id;
                    $x["service_id"] = $val->service_id;
                    $x["created_at"] = Carbon::now();
                    $x["updated_at"] = Carbon::now();

                    $us_plan_ser[] = $x;
                }
            }

            User_plan_services::insert($us_plan_ser);

            return $user_plan_id;
        } else {

            return null;
        }
    }

    /*
     * Update user plan one cycle (here cycle mean monthly/yearly)
     *
     * @$params $user_plan_id
     *
     * return type
     */
    function update_user_plan_one_cycle($user_plan_id, $end_date)
    {

        $user_plan = User_plan::find($user_plan_id);

        $end_date = Carbon::createFromTimestamp($end_date);
        $user_plan->plan_end_at = $end_date;

        $user_plan->save();
    }
}
