<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateCoupons extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('_coupon_id', 255)->nullable();
            $table->string('name', 255)->unique();
            $table->string('coupon_code', 255);
            $table->unsignedSmallInteger('coupon_type')->comment("1 - fixed amount /2 - percentage type");
            $table->double('amount', 10, 2)->nullable();
            $table->double('percentage', 2, 2)->nullable();
            $table->double('discount_up_to', 10, 2);
            $table->double('minimum_purchase_amount', 10, 2);
            $table->unsignedInteger('number_of_per_person_use');
            $table->unsignedInteger('number_of_uses');
            $table->unsignedInteger('remaining_uses');
            $table->date('start_at');
            $table->date('end_at');
            $table->text('description');
            $table->text('rz_response')->nullable();
            $table->foreignId('admin_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::unprepared('DROP TRIGGER  IF EXISTS `coupons_befor_insert__coupon_id`');
        DB::unprepared("CREATE TRIGGER `coupons_befor_insert__coupon_id` BEFORE INSERT ON `coupons` FOR EACH ROW
        IF NEW._coupon_id IS NULL or NEW._coupon_id='' THEN
          SET NEW._coupon_id = (SELECT CONCAT('C',(COALESCE((SELECT id FROM coupons ORDER BY id DESC LIMIT 1),0) + 1)+10000));
          END IF;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coupons');

        DB::unprepared('DROP TRIGGER  IF EXISTS `coupons_befor_insert__coupon_id`');
    }
}
