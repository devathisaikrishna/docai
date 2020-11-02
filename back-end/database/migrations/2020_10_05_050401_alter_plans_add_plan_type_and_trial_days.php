<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterPlansAddPlanTypeAndTrialDays extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plans', function (Blueprint $table) {
            if (!Schema::hasColumn('plans', 'plan_type')) {
                $table->unsignedSmallInteger("plan_type")->after("num_of_hit")->comment("1 - Paid/ 2 - Trail");
            }

            if (Schema::hasColumn('plans', 'duration')) {
                $table->unsignedSmallInteger("duration")->comment("1 - monthly/ 2 - yearly")->change();
            }

            if (!Schema::hasColumn('plans', 'trial_duration')) {
                $table->unsignedSmallInteger("trial_duration")->after("duration")->comment("In days");
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
        Schema::table('plans', function (Blueprint $table) {
            if (Schema::hasColumn('plans', 'plan_name')) {
                $table->dropColumn("plan_type");
            }

            if (Schema::hasColumn('plans', 'trial_duration')) {
                $table->dropColumn("trial_duration");
            }
        });
    }
}
