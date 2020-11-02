<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Validator;

use App\Models\Admin;
use App\Models\Password_reset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use App\Traits\CommonMethod;
use Hash;

class ForgotPasswordController extends Controller
{
    use CommonMethod;
    /**
    * Create a new password controller instance.
    *
    * @return void
    */
   public function __construct()
   {
       $this->middleware('guest');
   }
   
    
    protected function guard()
    {
        return Auth::guard('api-admin');
    }


    public function forgotPassword(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        try {
            
            $response = Password::broker('admins')->sendResetLink(
                $request->only('email')
            );
            
            
            switch ($response) {
                case Password::RESET_LINK_SENT:
                    return \Response::json(["message" => "Reset password link sent on your email id."], 200);
                case Password::INVALID_USER:
                    return \Response::json(["error" => "Email address not found."], 400);
                case "passwords.throttled":
                    return \Response::json(["error" => "Too Many Requests."], 429);
            }
        } catch (\Swift_TransportException $ex) {
           return \Response::json(["error" => $ex->getMessage()]);
         
        } catch (Exception $ex) {
            return \Response::json(["error" => $ex->getMessage()]);
        }
    }
    
    public function resetPassword(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:4|regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/',
            'confirm_password' => 'required|same:password',
        ]);
        
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $reset_password_status = Password::broker('admins')->reset(["email" => $request->email, "token" => $request->token, "password" => Hash::make($request->password)], function ($admin, $password) {
            $admin->password = $password;
            $admin->save();
        });

        if ($reset_password_status == Password::INVALID_TOKEN) {
            return response()->json(["error" => "Invalid request/token"], 400);
        }

        return response()->json(["message" => "Password has been reset successfully"],200);
    }
}