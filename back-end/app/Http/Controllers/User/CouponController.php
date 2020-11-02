<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Rules\Plan_id;
use Validator;
use App\Traits\CommonMethod;
use App\Traits\CartOrderMethod;
use Illuminate\Support\Facades\Crypt;

class CouponController extends Controller
{
    use CommonMethod;
    use CartOrderMethod;

    function redeem_coupon_code(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'coupon_code' => "required",
            'plan_id' => ['required', new Plan_id],
            'billing_frequency' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = $request->user();

        // set coupon code
        $this->coupon_code = $request->coupon_code;

        // set user_id
        $this->user_id = $user->id;

        $plan_id = Crypt::decryptString($request->plan_id);
        $this->plan_id = $plan_id;
        $this->billing_frequency = $request->billing_frequency;
        $cart = $this->cart();

        // set cart data
        $this->cart = $cart;

        $res = $this->validate_coupon();

        if (!$res["status"]) {
            return response()->json(["error" => $res["error"]], 400);
        }

        $other = [
            "coupon" => [
                "coupon_code" => $request->coupon_code,
                "discount_amount" => $res["redeem_amount"]
            ]
        ];

        $cart = $this->cart($other);

        return response()->json(["message" => "Successfully Applied", "discount_amount" => $res["redeem_amount"]], 200);
    }
}
