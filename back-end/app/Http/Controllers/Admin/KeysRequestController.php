<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Api_key_requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\CommonMethod;
use Validator;

class KeysRequestController extends Controller
{
    use CommonMethod;

    function api_key_request_listing(Request $request)
    {
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $search_column = ["id", DB::raw("(select concat_ws(' ',firstname, lastname) from users where id = api_key_requests.user_id)")];
        $columns = [
            'id', DB::raw("(select concat_ws(' ',firstname, lastname) from users where id = api_key_requests.user_id) as user_name"),
            DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y') as request_at"),
            DB::raw("(select concat_ws(' ',firstname, lastname) from admins where id = api_key_requests.approve_by) as approver_name"),
            DB::raw("(CASE WHEN status = 1 THEN 'Pending' WHEN status = 2 THEN 'Approved' WHEN status = 3 THEN 'Denied' WHEN status = 4 THEN 'Cancelled' else '' end) as status_label"),
            "status"
        ];

        $paginator = Api_key_requests::select($columns);

        if (!empty($request->sort_by)) {
            foreach ($request->sort_by as $val) {
                $paginator->orderBy($val['id'], $val['desc'] ? "DESC" : "ASC");
            }
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

    function approve_deny_key_request(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();

            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $Api_key_requests = Api_key_requests::find($request->id);

        $Api_key_requests->status = $request->status;
        $Api_key_requests->approve_by = $request->user()->id;
        $Api_key_requests->approve_at = \Carbon\Carbon::now();

        $Api_key_requests->save();

        return response()->json(['message' => "Updated Successfully"], 200);
    }
}
