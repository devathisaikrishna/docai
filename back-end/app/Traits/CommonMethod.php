<?php

namespace App\Traits;

trait CommonMethod {

    public function simplfyError($errors) {
        $err = [];
        foreach ($errors as $val) {
            $err[] = $val[0];
        }

        return $err;
    }

    public function calculate_GST($amount) {
        $gst = 0;

        $amount = (float) $amount;
        if($amount > 0){
            $gst = ($amount*10)/100;
        }

        return $gst;
    }
}
