<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
// use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class VerificationController extends Controller
{
    // use VerifiesEmails;


    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth:api');
        // $this->middleware('signed')->only('verify');
        // $this->middleware('throttle:6,1')->only('verify', 'resend');
    }

    /**
     * Show the email verification notice.
     *
     */
    public function show()
    {
        //
    }

    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verify($user_id, Request $request)
    {
        if (!$request->hasValidSignature()) {
            return response()->json(["error" => "Invalid/Expired url provided."], 401);
        }

        $user = User::findOrFail($user_id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 401);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['error' => 'Your email is already verified'], 422);
        }

        $user->markEmailAsVerified();

        return response()->json(['message' => 'Email verified!'], 200);
    }

    /**
     * Resend the email verification notification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resend(Request $request)
    {

        $user = User::where("email", $request->email)->first();

        if (!$user) {
            return response()->json('User email does not exist', 401);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(["error" => "User already have verified email!"], 422);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(["message" => "Mail sended. Please check your mail box"]);
    }
}
