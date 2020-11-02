<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Api_key_requests;
use App\Models\Project;
use App\Traits\CommonMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Passport\Client as PassportClient;

class ProjectsController extends Controller
{
    use CommonMethod;
    const REQUIRED_RULE = 'required|max:191';
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

        $search_column = ["id", "name", "created_at"];
        $columns = ['id', "name", "allow_domain", DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y') as created")];

        $paginator = Project::select($columns)->where('user_id', $user->id);

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
    public function create(Request $request)
    {
        $user = $request->user();

        $apiRequest = Api_key_requests::where(['user_id' => $user->id])
            ->whereIn("status", [1, 2, 3, 4])
            ->first();

        if ($apiRequest->status !== null && $apiRequest->status !== 2) {
            return response()->json(["error" => "Your are not authorized to create a project"], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => self::REQUIRED_RULE,
            'redirect' => self::REQUIRED_RULE,
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = $request->user();

        $project = new PassportClient();
        $project->user_id =  $user->id;
        $project->name =  $request->name;
        $project->secret = base64_encode(hash_hmac('sha256', Hash::make($user->id), 'secret', true));
        $project->password_client = 0;
        $project->personal_access_client   =  0;
        $project->redirect =  $request->redirect;
        if(isset($request->allow_domain) && !empty($request->allow_domain)){
            $project->allow_domain =  $request->allow_domain;
        }
        $project->revoked =  0;
        $project->save(); // Saving oauth client

        return response()->json(['client' => $project->id, 'message' => 'Project Created Successfully.'], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Project $project)
    {
        $user = $request->user();
        if ($project->user_id === $user->id) {
            return response()->json(['data' => $project], 200);
        } else {
            return response()->json(['error' => 'User is not authorised.'], 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        return $this->edit($request);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = $request->user();

        $result = DB::table('oauth_clients')
            ->select(DB::raw('id, name, redirect, allow_domain'))
            ->where('id', $request->id)
            ->where('user_id', $user->id)
            ->where('deleted_at', null)
            ->get();

        $res = [
            "data" => $result ?? []
        ];

        return response()->json($res, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'name' => self::REQUIRED_RULE,
            'redirect' => self::REQUIRED_RULE,
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $request = DB::table('oauth_clients')
            ->where('id', $request->id)
            ->where('deleted_at', null)
            ->update(['name' => $request->name, 'redirect' => $request->redirect, 'allow_domain' => (isset($request->allow_domain) && !empty($request->allow_domain))?$request->allow_domain:null]);

        return response()->json(['message' => 'Project Updated Successfully.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        Project::destroy($request->id);
        return response()->json(['message' => 'Project Archived Successfully.'], 200);
    }
}
