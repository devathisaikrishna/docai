<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserPlansAddPlanTypeAndDurationDays extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            if (!Schema::hasColumn('user_plans', 'plan_type')) {
                $table->unsignedSmallInteger("plan_type")->after("num_of_hit")->comment("1 - Paid/ 2 - Trail");
            }

            if (Schema::hasColumn('user_plans', 'duration')) {
                $table->unsignedSmallInteger("duration")->comment("1 - monthly/ 2 - yearly")->change();
            }

            if (!Schema::hasColumn('user_plans', 'duration_days')) {
                $table->unsignedSmallInteger("duration_days")->after("duration")->comment("In days");
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            if (Schema::hasColumn('user_plans', 'plan_name')) {
                $table->dropColumn("plan_type");
            }

            if (Schema::hasColumn('user_plans', 'duration_days')) {
                $table->dropColumn("duration_days");
            }
        });
    }
}
