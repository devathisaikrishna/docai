<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Plan;
use App\Models\Plan_services;
use Validator;
use Illuminate\Validation\Rule;
use App\Traits\CommonMethod;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PlanController extends Controller
{
    use CommonMethod;

    function get_system_services(Request $request)
    {
        // here total service is not more that 10 so we can use all keyword
        $services = Service::all();
        $services = $services->toArray();

        $res = [];
        if (!empty($services)) {
            foreach ($services as $val) {

                if ($val['parent_service_id']) {
                    $index = array_search($val['parent_service_id'], array_column($res, "id"));

                    $res[$index]["sub_services"][] = $val;
                } else {
                    $res[] = $val;
                }
            }
        }
        return response()->json($res, 200);
    }

    protected function validate_plan_data(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ["required",  Rule::unique('plans')->ignore($request->id ?? '')->where(function ($query) {
                return $query->where('deleted_at', null);
            })],
            'num_of_hit' => 'required',
            'plan_type' => ['required'],
            'year_price' => 'required_if:plan_type,1',
            'month_price' => 'required_if:plan_type,1',
            'trial_duration' => 'required_if:plan_type,2',
            'services' => [function ($attribute, $value, $fail) {
                $found_checked = false;

                if (!empty($value)) {
                    foreach ($value as $val) {
                        if (!empty($val['checked'])) {
                            $found_checked = true;
                        }

                        if (!empty($val['sub_services'])) {
                            foreach ($val['sub_services'] as $ser) {
                                if (!empty($ser['checked'])) {
                                    $found_checked = true;
                                }
                            }
                        }
                    }
                }

                if (!$found_checked) {
                    $fail('Please check at least one service for create plan');
                }
            }],
        ]);
        return $validator;
    }

    public function save_plan(Request $request)
    {
        $validator = $this->validate_plan_data($request);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $Plan = Plan::firstOrNew(['id' => $request->id ?? null]);;
        $Plan->name = $request->name;
        $Plan->slug = \Str::slug($request->name);
        $Plan->num_of_hit = $request->num_of_hit;
        $Plan->plan_type = $request->plan_type;
        $Plan->trial_duration = ((int)$Plan->plan_type === 2) ? $request->trial_duration : 0;
        $Plan->year_price = ((int)$Plan->plan_type === 2) ? 0 : $request->year_price;
        $Plan->month_price = ((int)$Plan->plan_type === 2) ? 0 : $request->month_price;

        $Plan->save();

        $services = [];
        foreach ($request->services as $val) {
            if (!empty($val['checked'])) {
                $x["plan_id"] = $Plan->id;
                $x["service_id"] = $val["id"];
                $x["created_at"] = Carbon::now();
                $x["updated_at"] = Carbon::now();

                $services[] = $x;
            }

            if (!empty($val["sub_services"])) {
                foreach ($val["sub_services"] as $ser) {

                    if (!empty($ser['checked'])) {
                        $x["plan_id"] = $Plan->id;
                        $x["service_id"] = $ser["id"];
                        $x["created_at"] = Carbon::now();
                        $x["updated_at"] = Carbon::now();

                        $services[] = $x;
                    }
                }
            }
        }

        Plan_services::where("plan_id", $Plan->id)->update(["deleted_at" => Carbon::now()]);
        Plan_services::insert($services);

        return response()->json(["message" => "Plan save successfully"], 200);
    }

    function plan_listing(Request $request)
    {
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $columns = [
            "id", "name", "num_of_hit", "year_price", "month_price", "status", DB::raw("(CASE when plan_type = 1 THEN 'Paid' When plan_type = 2 THEN 'Trail' else '' end) as plan_type"),
            DB::raw("(CASE When plan_type = 2 THEN concat(trial_duration, ' days') else 'Depend on Plan' end) as duration")
        ];
        $search_column = ["id", "name", "num_of_hit", "month_price", "year_price"];

        $paginator = Plan::select($columns)->where('deleted_at', null)->status_label();

        if (!empty($request->sort_by)) {
            foreach ($request->sort_by as $val) {
                $paginator->orderBy($val['id'], $val['desc'] ? "DESC" : "ASC");
            }
        }else{
            $paginator->orderBy("created_at", "DESC");
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

        $res = [
            "data" => $result["data"] ?? [],
            "total" => $result["total"] ?? 0
        ];

        return response()->json($res, 200);
    }

    function archive_plan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $Plan = Plan::findorfail($request->plan_id);
        $Plan->delete();

        return response()->json(["message" => "Plan archived"], 200);
    }

    function get_plan_details(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $Plan = Plan::select(["name", "num_of_hit", "plan_type", "trial_duration", "year_price", "month_price", "id"])->where("id", $request->plan_id)->first();
        $Plan->services;

        $res = $Plan->toArray();

        $res["services_ids"] = array_column($res["services"], "service_id");
        unset($res["services"]);

        return response()->json($res, 200);
    }

    function get_plan_options()
    {
        $Plan = Plan::select(["name", "id"])->where(["plan_type" => 2, "status" => 1])->get();

        return response()->json($Plan, 200);
    }
}
