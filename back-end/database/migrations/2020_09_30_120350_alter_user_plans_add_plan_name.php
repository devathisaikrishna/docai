<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserPlansAddPlanName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            if (!Schema::hasColumn('user_plans', 'plan_name')) {
                $table->string("plan_name", 200)->after("plan_id");
            }

            if (!Schema::hasColumn('user_plans', 'remaining_hit')) {
                $table->integer("remaining_hit")->after("num_of_hit");
            }

            if (!Schema::hasColumn('user_plans', 'allocation_type')) {
                $table->unsignedSmallInteger("allocation_type")->comment("1 - user purchase/ 2 - By admin")->after("price");
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
                $table->dropColumn("plan_name");
            }

            if (Schema::hasColumn('user_plans', 'remaining_hit')) {
                $table->dropColumn("remaining_hit");
            }

            if (Schema::hasColumn('user_plans', 'allocation_type')) {
                $table->dropColumn("allocation_type");
            }
        });
    }
}
