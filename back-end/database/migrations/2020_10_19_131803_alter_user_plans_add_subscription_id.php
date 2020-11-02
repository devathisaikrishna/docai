<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserPlansAddSubscriptionId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_plans', function (Blueprint $table) {
            if (!Schema::hasColumn("user_plans", "subscription_id")) {
                $table->bigInteger('subscription_id')->unsigned()->index()->nullable()->after("_user_plan_id"); 
                $table->foreign('subscription_id')->references('id')->on('subscriptions')->onDelete('cascade'); 
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
            if (Schema::hasColumn("user_plans", "subscription_id")) {
                $table->dropColumn('subscription_id');
            }
        });
    }
}
