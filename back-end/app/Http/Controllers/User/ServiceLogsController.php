<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Service_log;
use Illuminate\Http\Request;
use App\Traits\CommonMethod;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ServiceLogsController extends Controller
{
    use CommonMethod;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;
        
        $search_column = ["id", "request_domain", "ip_address", "created_at", "ai_response_status"];
        $columns = [
            'id',
            "project_id",
            "ip_address",
            "request_domain",
            DB::raw(
                "DATE_FORMAT(created_at, '%d/%m/%Y') as created,
                (select name from oauth_clients where oauth_clients.id = service_logs.project_id) as name,
                (select name from services where services.id = service_logs.service_id) as service"
            ),
            "ai_response_status"
        ];

        $paginator = Service_log::with('project')
            ->select($columns)
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'DESC');

        if (!empty($request->id)) {
            $paginator->where('project_id', $request->id);
        }

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

        $paginator = $paginator->paginate($perPage, [], "PAGE", $pageNum);

        $result = collect($paginator);
   
        $res = [
            "data" => $result["data"] ?? [],
            "total" => $result["total"] ?? 0,
        ];

        return response()->json($res, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = $request->user();

        $columns = [
            'id',
            // "token",
            "project_id",
            "requested_file_path",
            "request_domain",
            "ip_address",
            "user_agent",
            "ai_response",
            "ai_response_status",
            DB::raw(
                "DATE_FORMAT(created_at, '%d/%m/%Y') as created,
                (select name from oauth_clients where oauth_clients.id = service_logs.project_id) as name"
            )
        ];

        $result = Service_log::select($columns)
            ->where(['user_id' => $user->id, 'id' => $request->id])
            ->get();

        $res = [
            "data" => collect($result) ?? []
        ];

        return response()->json($res, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
