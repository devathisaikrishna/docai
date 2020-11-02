<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreatePayments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('_payment_id', 255)->nullable();
            $table->string('rz_transaction_id', 255)->nullable()->comment('transaction_id of payment gatway');
            $table->foreignId('subscription_id')->constrained('subscriptions');
            $table->foreignId('user_id')->constrained('users');
            $table->double('plan_amount', 10, 2);
            $table->foreignId('coupon_id')->constrained('coupons')->nullable();
            $table->double('discount_amount', 10, 2)->nullable();
            $table->string('coupon_name', 255)->nullable();
            $table->double('sub_total', 10, 2)->comment("(plan_amount  - discount_amount)");
            $table->double('gst', 10, 2)->comment("apply on sub_total");
            $table->double('total', 10, 2)->comment("(sub_total + gst)");

            $table->unsignedSmallInteger('payment_type')->comment("1 - credit/2 - debit");
            $table->text('comment_note')->nullable();
            $table->unsignedSmallInteger('payment_status')->comment("1 - pending/2 - success/3 - refunded/4 - failed");
            $table->text('rz_response_msg')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->text('rz_response')->nullable();
            $table->timestamps();
        });

        DB::unprepared('DROP TRIGGER  IF EXISTS `payments_befor_insert__payment_id`');
        DB::unprepared("CREATE TRIGGER `payments_befor_insert__payment_id` BEFORE INSERT ON `payments` FOR EACH ROW
        IF NEW._payment_id IS NULL or NEW._payment_id='' THEN
          SET NEW._payment_id = (SELECT CONCAT('C',(COALESCE((SELECT id FROM payments ORDER BY id DESC LIMIT 1),0) + 1)+10000));
          END IF;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payments');

        DB::unprepared('DROP TRIGGER  IF EXISTS `payments_befor_insert__payment_id`');
    }
}
