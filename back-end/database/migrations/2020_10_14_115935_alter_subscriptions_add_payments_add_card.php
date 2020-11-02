<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSubscriptionsAddPaymentsAddCard extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {

            if (!Schema::hasColumn("payments", "card")) {
                $table->text("card")->comment("payment card details")->after("total");
            }
            if (!Schema::hasColumn("payments", "cart")) {
                $table->text("cart")->comment("payment cart ")->after("total");
            }
            if (Schema::hasColumn("payments", "coupon_id")) {
                $table->unsignedBigInteger('coupon_id')->nullable()->change();
            }

            if (!Schema::hasColumn("payments", "rz_order_id")) {
                $table->string('rz_order_id', 255)->nullable()->after("_payment_id")->comment("order id of razorpay");
            }

            if (!Schema::hasColumn("payments", "rz_capture_amount")) {
                $table->double('rz_capture_amount', 10, 2)->nullable()->after("total")->comment("transaction amount of razorpay");
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
        Schema::table('payments', function (Blueprint $table) {
            if (Schema::hasColumn("payments", "card")) {
                $table->dropColumn("card");
            }
            if (Schema::hasColumn("payments", "cart")) {
                $table->dropColumn("cart");
            }

            if (Schema::hasColumn("payments", "rz_order_id")) {
                $table->dropColumn('rz_order_id');
            }

            if (Schema::hasColumn("payments", "rz_capture_amount")) {
                $table->dropColumn('rz_capture_amount');
            }
        });
    }
}
