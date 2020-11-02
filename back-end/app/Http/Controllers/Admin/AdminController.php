<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Validator;
use Hash;
use App\Traits\CommonMethod;

class AdminController extends Controller
{
    use CommonMethod;
    public function getProfile(Request $request){

        $admin = $request->user();
            return response()->json([
                "firstname"=> $admin->firstname,
                "lastname"=> $admin->lastname,
                "email"=> $admin->email,
                "phone"=> $admin->phone,
                "created_at"=> $admin->created_at->format('d/m/Y'),
                "profile_photo_url"=> $admin->profile_photo_url
            ], 200);
    }
    
    public function updateProfile(Request $request){
        
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:admins,email,'.$user->id,
            'firstname' => 'required|max:200',
            'lastname' => 'required|max:200',
            'phone' => 'required|min:10|max:18|regex:/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,18}$/',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }
        try{
            $user->update($request->all());
            return response()->json(["message"=>"Profile has been updated successfully."], 200);
        } catch (QueryException $ex) {
            return \Response::json(["error" => $ex->getMessage()],400);
        }
    }

    public function updatePassword(Request $request){
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'currentPassword' => 'required|min:4|max:100',
            'newPassword' => 'required|min:4|different:oldPassword|max:100',
            'confirmPassword' => 'required|same:newPassword',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        if (\Hash::check($request->currentPassword, $user->password)) {
            if (!\Hash::check($request->newPassword , $user->password)) {
            
                $user->fill([
                    'password' => Hash::make($request->newPassword)
                    ])->save();
                return response()->json(['message' => "Your password has been updated successfully."], 200);
            }else{
                return response()->json(['error' => "Old and New password is same."], 400);
            }
        } else {
            return response()->json(['error' => "Old password dose not match."], 400);
        }
    }
}
