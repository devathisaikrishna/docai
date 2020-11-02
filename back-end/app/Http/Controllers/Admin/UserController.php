<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\User;
use App\Models\User_plan;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    function user_listing(Request $request)
    {
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $search_column = ["id", "email", "phone", DB::raw("concat_ws(' ',firstname, lastname)")];
        $columns = ['id', DB::raw("concat_ws(' ',firstname, lastname) as fullname"), "email", "phone", DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y') as created")];

        $paginator = User::select($columns)->with("user_current_plan");

        if (!empty($request->sort_by)) {
            foreach ($request->sort_by as $val) {
                $paginator->orderBy($val['id'], $val['desc'] ? "DESC" : "ASC");
            }
        }else{
            $paginator->orderBy("id", "DESC");
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

    function archive_user(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = User::findorfail($request->user_id);
        $user->delete();

        return response()->json(["message" => "User archived successfully"], 200);
    }
}
