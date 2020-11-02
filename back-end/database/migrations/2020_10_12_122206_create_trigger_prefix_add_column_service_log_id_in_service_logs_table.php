<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTriggerPrefixAddColumnServiceLogIdInServiceLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('service_logs')) {
            Schema::table('service_logs', function (Blueprint $table) {
                if (!Schema::hasColumn('service_logs', '_service_log_id')) {
                    $table->string('_service_log_id',255)->nullable()->after('id')->comment('auto genrate _service_log_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `service_logs_before_insert__service_log_id`');
            DB::unprepared("CREATE TRIGGER `service_logs_before_insert__service_log_id` BEFORE INSERT ON `service_logs` FOR EACH ROW
            IF NEW._service_log_id IS NULL or NEW._service_log_id='' THEN
            SET NEW._service_log_id = (SELECT CONCAT('SL',(COALESCE((SELECT id FROM service_logs ORDER BY id DESC LIMIT 1),0) + 1)+10000));
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
        if (Schema::hasTable('service_logs')) {
            Schema::table('service_logs', function (Blueprint $table) {
                if (Schema::hasColumn('service_logs', '_service_log_id')) {
                    $table->dropColumn('_service_log_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `service_logs_before_insert__service_log_id`');
        }
    }
}
