<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableContactUs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('contact_us')){
            Schema::create('contact_us', function (Blueprint $table) {
                $table->id();
                $table->string('name',255)->nullable();
                $table->string('email',255)->nullable()->index('email');
                $table->string('phone',20)->nullable();
                $table->text('message')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if(Schema::hasTable('contact_us')){
            Schema::dropIfExists('contact_us');
        }
    }
}
