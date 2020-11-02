<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTriggerPrefixAddColumnServiceIdInServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('services')) {
            Schema::table('services', function (Blueprint $table) {
                if (!Schema::hasColumn('services', '_service_id')) {
                    $table->string('_service_id',255)->nullable()->after('id')->comment('auto genrate _service_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `services_before_insert__service_id`');
            DB::unprepared("CREATE TRIGGER `services_before_insert__service_id` BEFORE INSERT ON `services` FOR EACH ROW
            IF NEW._service_id IS NULL or NEW._service_id='' THEN
            SET NEW._service_id = (SELECT CONCAT('S',(COALESCE((SELECT id FROM services ORDER BY id DESC LIMIT 1),0) + 1)+10000));
            END IF;");
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('services')) {
            Schema::table('services', function (Blueprint $table) {
                if (Schema::hasColumn('services', '_service_id')) {
                    $table->dropColumn('_service_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `services_before_insert__service_id`');
        }
    }
}