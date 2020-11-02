<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use Carbon\Carbon;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
            'firstname' => "Css",
            'lastname' => "India",
            'email' => "testteam.developer@gmail.com",
            'password' => Hash::make("12345678"),
            'phone' => "9876543210",
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        DB::table('admins')->insert([
            'firstname' => "Girish",
            'lastname' => "Bagmor",
            'email' => "girish.bagmor@cssindiaonline.com",
            'password' => Hash::make("12345678"),
            'phone' => "9876543210",
            'email_verified_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}