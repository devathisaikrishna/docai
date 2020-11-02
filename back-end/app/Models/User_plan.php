<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class User_plan extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'subscription_id',
        'user_id',
        'plan_id',
        'plan_name',
        'num_of_hit',
        'remaining_hit',
        'duration',
        'plan_start_at',
        'plan_end_at',
        'price',
        'allocation_type',
    ];

    /*
     * relation belongsTo to user
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'foreign_key', 'user_id');
    }

    /*
     * for get current user plan
     *
     * @parmas $query
     *
     */
    public function scopeUser_current_plan($query)
    {
        return $query->whereBetween(DB::raw('NOW()'), [DB::raw('plan_start_at'), DB::raw('plan_end_at')])->plan_type_label();
    }

    /*
     * for get plan type label
     *
     * @parmas $query
     *
     */
    public function scopePlan_type_label($query)
    {
        return $query->addSelect([DB::raw("(CASE WHEN plan_type = 1 THEN 'Paid' WHEN plan_type = 2 THEN 'Trail' else 'N/A' end) as plan_type_label")]);
    }

    /*
     * for get duration of plan (billing frequency)
     *
     * @parmas $query
     *
     */
    public function scopeDuration_label($query)
    {
        return $query->addSelect([DB::raw("(CASE WHEN duration = 1 THEN 'Monthly' WHEN duration = 2 THEN 'Yearly' else 'N/A' end) as duration_type_label")]);
    }

    function check_permission_to_access_service($user_id, $service_type)
    {
        $user_plan = DB::table('user_plans')->select("user_plans.id", "user_plans.remaining_hit")
            ->join('user_plan_services as ups', function ($join) use ($service_type) {
                $join->on('ups.user_plan_id', '=', 'user_plans.id')
                    ->where('ups.deleted_at', null)
                    ->whereRaw(DB::raw("ups.service_id = (select id from services where key_name = '" . $service_type . "')"));
            })
            ->where("user_id", $user_id)
            ->whereRaw(DB::raw("NOW() between plan_start_at and plan_end_at"))
            ->first();

        return (array) $user_plan;
    }

}
