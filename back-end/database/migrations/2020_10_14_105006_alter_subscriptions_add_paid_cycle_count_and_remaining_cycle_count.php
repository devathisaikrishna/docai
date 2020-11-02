<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSubscriptionsAddPaidCycleCountAndRemainingCycleCount extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            if (!Schema::hasColumn("subscriptions", "paid_cycle_count")) {
                $table->unsignedInteger("paid_cycle_count")->after("cycle_count");
            }
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            if (!Schema::hasColumn("subscriptions", "remaining_cycle_count")) {
                $table->unsignedInteger("remaining_cycle_count")->after("paid_cycle_count");
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
        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn("subscriptions", "paid_cycle_count")) {
                $table->dropColumn("paid_cycle_count");
            }

            if (Schema::hasColumn("subscriptions", "remaining_cycle_count")) {
                $table->dropColumn("remaining_cycle_count");
            }
        });
    }
}
