<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTriggerPrefixAddColumnPlanIdPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('plans')) {
            Schema::table('plans', function (Blueprint $table) {
                if (!Schema::hasColumn('plans', '_plan_id')) {
                    $table->string('_plan_id',255)->nullable()->after('id')->comment('auto genrate _plan_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `plans_before_insert__plan_id`');
            DB::unprepared("CREATE TRIGGER `plans_before_insert__plan_id` BEFORE INSERT ON `plans` FOR EACH ROW
            IF NEW._plan_id IS NULL or NEW._plan_id='' THEN
            SET NEW._plan_id = (SELECT CONCAT('PL',(COALESCE((SELECT id FROM plans ORDER BY id DESC LIMIT 1),0) + 1)+10000));
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
        if (Schema::hasTable('plans')) {
            Schema::table('plans', function (Blueprint $table) {
                if (Schema::hasColumn('plans', '_plan_id')) {
                    $table->dropColumn('_plan_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `plans_before_insert__plan_id`');
        }
    }
}
