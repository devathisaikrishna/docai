<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;

use App\Models\User;
use App\Models\Password_reset;
use Illuminate\Support\Facades\Password;
use App\Traits\CommonMethod;
use Hash;

class ForgotPasswordController extends Controller
{

    use CommonMethod;

    public function __construct(){
        // $this->middleware('throttle:1,60', ['except' => 'showLinkRequestForm']);
    }


    function forgot_password(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        try {
            $response = Password::sendResetLink(
                $request->only('email')
            );

            switch ($response) {
                case Password::RESET_LINK_SENT:
                    return \Response::json(["message" => "Reset password link sent on your email id."], 200);
                case Password::INVALID_USER:
                    return \Response::json(["error" => "User not exist with this email address"], 400);
                case "passwords.throttled":
                    return \Response::json(["error" => "Too Many Requests"], 429);
            }
        } catch (\Swift_TransportException $ex) {
           return \Response::json(["error" => $ex->getMessage()]);

        } catch (Exception $ex) {
            return \Response::json(["error" => $ex->getMessage()]);
        }
    }

    function reset_password(Request $request){

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'token' => 'required|string'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $reset_password_status = Password::reset(["email" => $request->email, "token" => $request->token, "password" => Hash::make($request->password)], function ($user, $password) {
            $user->password = $password;
            $user->save();
        });

        if ($reset_password_status == Password::INVALID_TOKEN) {
            return response()->json(["error" => "Invalid request/token"], 400);
        }

        return response()->json(["message" => "Password has been successfully changed"],200);
    }
}
