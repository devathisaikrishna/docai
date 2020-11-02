<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterServicesPlansChangeDurationDurationDays extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plans', function (Blueprint $table) {
            if (Schema::hasColumn('plans', 'duration')) {
                $table->string("duration", 20)->comment("in days")->change();
            }
        });

        Schema::table('user_plans', function (Blueprint $table) {
            if (Schema::hasColumn('user_plans', 'duration')) {
                $table->string("duration", 20)->comment("in days")->change();
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
            //
        });
    }
}
