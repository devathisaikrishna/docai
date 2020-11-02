<?php

return [
    /*
    |--------------------------------------------------------------------------
    | key Id
    |--------------------------------------------------------------------------
    |
    | This option use for mention key id of razorpay account
    | It's use as username to intract with razorpay as api for trabsaction,
    | subscription etc
    |
    */

    'key_id' => env('RAZORPAY_KEY_ID', ''),

    /*
    |--------------------------------------------------------------------------
    | key secret
    |--------------------------------------------------------------------------
    |
    | This option use for mention Secret key of razorpay account
    | It's use as password to intract with razorpay as api for trabsaction,
    | subscription etc
    |
    */

    'key_Secret' => env('RAZORPAY_SECRET_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | key secret
    |--------------------------------------------------------------------------
    |
    | This option use for mention Secret key of razorpay account
    | It's use as password to intract with razorpay as api for trabsaction,
    | subscription etc
    |
    */

    'webhook_validate_key' => env('RAZORPAY_WEBHOOK_VALIDATE_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | This option use for mention currency of razorpay transaction
    |
    | here set default INR  ( Indian currency)
    */

    'currency' => "INR",

    /*
    |--------------------------------------------------------------------------
    | Currency Sign
    |--------------------------------------------------------------------------
    |
    | This option use for mention currency sign for show everywhere
    |
    | here set default INR  ( ₹)
    */

    'currency_sign' => "₹",

     /*
    |--------------------------------------------------------------------------
    | rz_master_plan_id (Razorpay Tempory Plan id)
    |--------------------------------------------------------------------------
    |
    | This option use for get tempory plan id of razor pay and it's plan default 
    | amount is set ₹1 
    |
    */

    'rz_master_plan_id' => "plan_Fp7hBLMuWi5krZ",

     /*
    |--------------------------------------------------------------------------
    | Monthly cycle
    |--------------------------------------------------------------------------
    |
    | This option use for set default cycle like how mouch time we have to charge
    |
    | here set default 12 month (1 year)
    */

    'month_cycle' => 12,

     /*
    |--------------------------------------------------------------------------
    | Year cycle
    |--------------------------------------------------------------------------
    |
    | This option use for set default cycle like how mouch time we have to charge
    |
    | here set default 6 (6 year)
    */

    'year_cycle' => 6,

    /*
    |--------------------------------------------------------------------------
    | Default Configuration
    |--------------------------------------------------------------------------
    |
    | Set default configuration like store name, address, logo, contact number and email
    | it's duration payment time
    |
    */

    'default_configuration' => [
        // store name
        "name" => env("APP_NAME" ?? ""),
        // "description" => "Tron Legacy",
        // "image" => "https://s29.postimg.org/r6dj1g85z/daft_punk.jpg",
        // store details
        "prefill" => [
            "name" => env("APP_NAME" ?? ""),
            "email" => "girish.bagmor@cssindiaonline.com",
            "contact" => "078288 09393",
        ],
        "notes" => [
            "address" => "712, Fortune Ambience Dhakkanwala Kuan, South Tukoganj, near Surya Hotel, Madhya Pradesh 452001",
            // "merchant_order_id" => "",
        ],
        // set theme color according our branch color
        "theme" => [
            "color" => "#F37254"
        ],
    ],

];
