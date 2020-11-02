<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterPlansUpdateDurationTypeToTwoPrice extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plans', function (Blueprint $table) {
            if (Schema::hasColumn("plans", "duration")) {
                $table->dropColumn("duration");
            }
            if (Schema::hasColumn("plans", "price")) {
                $table->dropColumn("price");
            }

            if (!Schema::hasColumn("plans", "month_price")) {
                $table->double("month_price", 10, 2)->after("trial_duration");
            }

            if (!Schema::hasColumn("plans", "year_price")) {
                $table->double("year_price", 10, 2)->after("trial_duration");
            }
        });

        Schema::table('plans', function (Blueprint $table) {
            if (!Schema::hasColumn("plans", "rz_month_plan_id")) {
                $table->string("rz_month_plan_id", 255)->nullable()->after("month_price");
            }

            if (!Schema::hasColumn("plans", "rz_year_plan_id")) {
                $table->string("rz_year_plan_id", 255)->nullable()->after("month_price");
            }
        });

        Schema::table('plans', function (Blueprint $table) {
            if (!Schema::hasColumn("plans", "status")) {
                $table->unsignedSmallInteger("status")->default(2)->comment("1 - enable/ 2 - disable")->after("rz_month_plan_id");
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
            if (Schema::hasColumn("plans", "month_price")) {
                $table->dropColumn("month_price");
            }

            if (Schema::hasColumn("plans", "year_price")) {
                $table->dropColumn("year_price");
            }

            if (Schema::hasColumn("plans", "rz_month_plan_id")) {
                $table->dropColumn("rz_month_plan_id");
            }

            if (Schema::hasColumn("plans", "rz_year_plan_id")) {
                $table->dropColumn("rz_year_plan_id");
            }

            if (Schema::hasColumn("plans", "status")) {
                $table->dropColumn("status");
            }
        });
    }
}
