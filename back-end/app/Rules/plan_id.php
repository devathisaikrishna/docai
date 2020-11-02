<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Plan;
use Illuminate\Support\Facades\Crypt;

class Plan_id implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $d_plan_id = Crypt::decryptString($value);

        if (!$d_plan_id) {
            return false;
        }

        $res = Plan::where(["id" => $d_plan_id, 'plan_type' => 1])->first();
        if (empty($res)) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Invalid plan Id.';
    }
}
