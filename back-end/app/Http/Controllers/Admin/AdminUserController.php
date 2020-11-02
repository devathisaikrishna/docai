<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Api_key_requests;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use App\Traits\CommonMethod;
use Carbon\Carbon;
use Validator;
use Hash;

class AdminUserController extends Controller
{
    use CommonMethod;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $loggedinUser = $request->user();
        if($loggedinUser->is_super_admin!=1){
            return response()->json(["error"=>"Permission access denided."],400);
        }
    
        $perPage = $request->page_size ?? 10;
        $start = request()->get('start', 0);
        $pageNum = ceil($start / $perPage) + 1;

        $search_column = ["id", "firstname", "lastname", "email", "phone", DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y')")];
        $columns = ['id', "firstname", "lastname", "email", "phone", "is_super_admin", DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y') as created")];

        $paginator = Admin::select($columns)->where('deleted_at', null);


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
        
        $res = [
            "data" => $result["data"] ?? [],
            "total" => $result["total"] ?? 0
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
        /**
         * Check is_super_admin only super admin will create new admin user.
         */
        $loggedinUser = $request->user();
        if($loggedinUser->is_super_admin != 1){
            return response()->json(["error" => "Permission access denied."],400);
        }

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|max:200',
            'lastname' => 'required|max:200',
            'email' => 'required|email|unique:admins,email',
            'phone' => 'required|min:10|max:18|regex:/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,18}$/',
            'password' => 'required|regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }
        
        try{
            $admin = new Admin;
            $admin->firstname = $request->firstname;
            $admin->lastname = $request->lastname;
            $admin->email = $request->email;
            $admin->phone = $request->phone;
            $admin->password = Hash::make($request->password);
            $admin->is_super_admin = 2;
            $admin->email_verified_at = Carbon::now();
            $admin->save();
            return response()->json(['message' => 'Admin has been created successfully.'], 200);
        } catch (QueryException $ex) {
            return \Response::json(["error" => $ex->getMessage()],400);
        }
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
     * @param  object  $request
     * @return \Illuminate\Http\Response
     */
    public function getAdminUser(Request $request)
    {
        $loggedinUser = $request->user();
        if($loggedinUser->is_super_admin!=1){
            return response()->json(["error"=>"Permission access denided."],400);
        }
        try{
            $admin = new Admin;
            $user = $admin->find($request->userid);
            return response()->json($user, 200);
        } catch (QueryException $ex) {
            return \Response::json(["error" => $ex->getMessage()],400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  object  $request
     * @return \Illuminate\Http\Response
     */
    public function updateAdminUser(Request $request)
    {
        $loggedinUser = $request->user();
        if($loggedinUser->is_super_admin!=1){
            return response()->json(["error"=>"Permission access denided."],400);
        }

        $admin = new Admin;
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|max:200',
            'lastname' => 'required|max:200',
            'email' => 'required|email|unique:admins,email,'.$request->id,
            'phone' => 'required|min:10|max:18|regex:/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,18}$/',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        try{
            $admin = Admin::find($request->id);
            $admin->firstname = $request->firstname;
            $admin->lastname = $request->lastname;
            $admin->email = $request->email;
            $admin->phone = $request->phone;
            $admin->save();
            return response()->json(["message"=>"Admin has been updated successfully."], 200);
        } catch (QueryException $ex) {
            return \Response::json(["error" => $ex->getMessage()],400);
        }

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
     * @param  object  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        $loggedinUser = $request->user();
        if($loggedinUser->is_super_admin!=1){
            return response()->json(["error"=>"Permission access denided."],400);
        }

        $admin = new Admin;
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        try{
            $admin = Admin::find($request->user_id);
            $admin->deleted_at = Carbon::now();
            $admin->save();
            return response()->json(["message"=>"Admin has been deleted successfully."], 200);
        } catch (QueryException $ex) {
            return \Response::json(["error" => $ex->getMessage()],400);
        }
    }

    
}