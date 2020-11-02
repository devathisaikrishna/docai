<?php

namespace Database\Seeders;

use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Service::create([
            'name' => 'Data Extraction API',
            'key_name' => 'data-extraction',
            'is_service' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $service = Service::create([
            'name' => 'Identity Document Classification API',
            'key_name' => 'identity-document',
            'is_service' => 0,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $servicesArray = [
            ['name' => 'Aadhaar Card',  'key_name' => 'aadhaar-card', 'is_service' => 1],
            ['name' => 'PAN Card',  'key_name' => 'pan-card', 'is_service' => 1],
            ['name' => 'VoterId Card',  'key_name' => 'voterId-card', 'is_service' => 1],
            ['name' => 'Passport',  'key_name' => 'passport', 'is_service' => 1],
            ['name' => 'Driving license',  'key_name' => 'driving-license', 'is_service' => 1],
        ];

        foreach ($servicesArray as $value) {
            DB::table('services')->insert([
                'name' => $value["name"],
                'key_name' => $value["key_name"],
                'is_service' => $value["is_service"],
                'parent_service_id' => $service->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
