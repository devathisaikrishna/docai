<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubscriptionsBillingAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscription_billing_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained('subscriptions');
            $table->string("firstname", 255);
            $table->string("lastname", 255);
            $table->string("email", 255);
            $table->string("country", 255);
            $table->string("address", 255);
            $table->string("address_optional", 255)->nullable();
            $table->string("state", 255);
            $table->string("city", 255);
            $table->string("pincode", 20);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscription_billing_addresses');
    }
}
