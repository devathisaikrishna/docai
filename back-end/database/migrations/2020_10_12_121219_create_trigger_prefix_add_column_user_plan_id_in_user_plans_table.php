<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTriggerPrefixAddColumnUserPlanIdInUserPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('user_plans')) {
            Schema::table('user_plans', function (Blueprint $table) {
                if (!Schema::hasColumn('user_plans', '_user_plan_id')) {
                    $table->string('_user_plan_id',255)->nullable()->after('id')->comment('auto genrate _user_plan_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `user_plans_before_insert__user_plan_id`');
            DB::unprepared("CREATE TRIGGER `user_plans_before_insert__user_plan_id` BEFORE INSERT ON `user_plans` FOR EACH ROW
            IF NEW._user_plan_id IS NULL or NEW._user_plan_id='' THEN
            SET NEW._user_plan_id = (SELECT CONCAT('UP',(COALESCE((SELECT id FROM user_plans ORDER BY id DESC LIMIT 1),0) + 1)+10000));
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
        if (Schema::hasTable('user_plans')) {
            Schema::table('user_plans', function (Blueprint $table) {
                if (Schema::hasColumn('user_plans', '_user_plan_id')) {
                    $table->dropColumn('_user_plan_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `user_plans_before_insert__user_plan_id`');
        }
    }
}
