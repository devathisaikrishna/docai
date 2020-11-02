<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Traits\CommonMethod;

class LoginController extends Controller
{
    use CommonMethod;

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) {
            $user = Auth::user();

            if ($user->email_verified_at) {
                $token =  $user->createToken('api-user');
                $response = response()->json([
                    'message' => "Login successfully",
                    "token" => $token->accessToken,
                    "user" => ['fullname' => ($user->firstname . ' ' . $user->lastname), 'email' => $user->email, 'phone' => $user->phone],
                    "expires" => $token->token->expires_at->timestamp
                ], 200);
            } else {
                Auth::logout();
                $response = response()->json(['error' => 'Your email is not verfied. Please click to resend email', 'email_not_verified' => true], 400);
            }
        } else {
            $response = response()->json(['error' => 'Invalid email or password'], 400);
        }

        return $response;
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];
        return response($response, 200);
    }
}
