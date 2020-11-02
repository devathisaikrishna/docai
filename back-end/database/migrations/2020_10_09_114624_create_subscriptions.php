<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateSubscriptions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('_subscription_id', 255)->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->string('rz_subscription_id', 255)->nullable()->comment("razorpay subscription id");
            $table->foreignId('plan_id')->constrained('plans');
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->unsignedInteger('billing_frequency')->comment("1 - Monthlt/ 2 - Yearly");
            $table->unsignedInteger('cycle_count');
            $table->unsignedSmallInteger('status')->comment("1 - pending/2 - activate/3 - completed/4 - exprird/5 - cancelled");
            $table->text('rz_response');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::unprepared('DROP TRIGGER  IF EXISTS `subscriptions_befor_insert__subscription_id`');
        DB::unprepared("CREATE TRIGGER `subscriptions_befor_insert__subscription_id` BEFORE INSERT ON `subscriptions` FOR EACH ROW
        IF NEW._subscription_id IS NULL or NEW._subscription_id='' THEN
          SET NEW._subscription_id = (SELECT CONCAT('SCP',(COALESCE((SELECT id FROM subscriptions ORDER BY id DESC LIMIT 1),0) + 1)+10000));
          END IF;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscriptions');

        DB::unprepared('DROP TRIGGER  IF EXISTS `subscriptions_befor_insert__subscription_id`');
    }
}
