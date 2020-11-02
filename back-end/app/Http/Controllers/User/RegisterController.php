<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;
use Hash;

class RegisterController extends Controller
{
    function register(Request $request)
    {
        $required = 'required|max:191';

        $validator = Validator::make($request->all(), [
            'firstname' => $required,
            'lastname' => $required,
            'email' => $required . '|email|unique:users,email',
            'phone' => 'required|integer',
            'password' => $required,
            'accountType' => 'required|integer|in:1,2',
            'organisationName' => 'exclude_if:accountType,1|string|' . $required
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            $err = [];
            foreach ($errors as $val) {
                $err[] = $val[0];
            }

            return response()->json(['error' => $err], 400);
        }

        $user = [
            'firstname' => $request->firstname,
            "lastname" => $request->lastname,
            "email" => $request->email,
            "phone" => $request->phone,
            "password" => Hash::make($request->password),
            "account_type" => $request->accountType,
            "organisation_name" => $request->organisationName
        ];

        User::create($user)->sendEmailVerificationNotification();

        return response()->json(['message' => 'Register Successfully. Please check email and complete email varification process'], 200);
    }
}
