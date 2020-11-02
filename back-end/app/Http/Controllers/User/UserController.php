<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Validator;
use Hash;
use App\Traits\CommonMethod;


class UserController extends Controller
{
    use CommonMethod;
    public function getProfile(Request $request){
        $user = $request->user();
        return response()->json([
            "firstname"=> $user->firstname,
            "lastname"=> $user->lastname,
            "email"=> $user->email,
            "phone"=> $user->phone,
            "created_at"=> $user->created_at->format('d/m/Y'),
            "profile_photo_url"=> $user->profile_photo_url
        ], 200);   
    }

    public function updateProfile(Request $request){
        
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email,'.$user->id,
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
            'oldPassword' => 'required',
            'newPassword' => 'required|different:oldPassword|max:100|regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/',
            'confirmPassword' => 'required|same:newPassword',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        if (\Hash::check($request->oldPassword, $user->password)) {
            if (!\Hash::check($request->newPassword , $user->password)) {
            
                $user->fill([
                    'password' => Hash::make($request->newPassword)
                    ])->save();
                return response()->json(['success' => "Password updated successfully."], 200);
            }else{
                return response()->json(['error' => "Old and New password is same."], 400);
            }
        } else {
            return response()->json(['error' => "Old password dose not match."], 400);
        }
    }
}
