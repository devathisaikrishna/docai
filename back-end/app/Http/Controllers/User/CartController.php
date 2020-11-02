<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Traits\CartOrderMethod;
use App\Traits\CommonMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use App\Rules\Plan_id;
use Validator;

# cart ref https://github.com/melihovv/laravel-shopping-cart

class CartController extends Controller
{
    use CommonMethod;
    use CartOrderMethod;

    public function get_cart(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'billing_frequency' => ['required'],
            'plan_id' => ['required', new Plan_id],
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $user = $request->user();

        $this->coupon_code = $request->coupon_code;
        $this->user_id = $user->id;

        $plan_id = Crypt::decryptString($request->plan_id);

        $this->plan_id = $plan_id;
        $this->billing_frequency = $request->billing_frequency;
        $this->cart = $this->cart();

        $res = $this->validate_coupon();

        if ($res["status"]) {
            $other = [
                "coupon" => [
                    "coupon_code" => $request->coupon_code,
                    "discount_amount" => $res["redeem_amount"],
                ],
            ];

            $this->cart = $this->cart($other);
        }

        return response()->json($this->cart, 200);
    }
}
