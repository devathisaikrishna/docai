<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;
use App\Models\Admin;

class LoginController extends Controller
{
    function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);


        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            $err = [];
            foreach ($errors as $key => $val) {
                $err[] = $val[0];
            }

            return response()->json(['error' => $err], 401);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (Auth::guard("admin")->attempt(["email" => $request->email, "password" => $request->password])) {

            $token = $admin->createToken('api-admin');

            return response()->json([
                'message' => "Login successfully.",
                "token" => $token->accessToken,
                "user" => ['fullname' => ($admin->firstname . ' ' . $admin->lastname), 'email' => $admin->email,'is_super_admin'=>$admin->is_super_admin],
                "expires" => $token->token->expires_at->timestamp
            ], 200);
        } else {
            return response()->json(['error' => 'Invalid email or password.'], 401);
        }
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!.'];
        return response($response, 200);
    }
}
