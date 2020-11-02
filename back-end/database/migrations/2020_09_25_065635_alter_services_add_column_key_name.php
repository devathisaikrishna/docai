<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterServicesAddColumnKeyName extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'key_name')) {
                $table->string('key_name')->after('name');
            }

            if (!Schema::hasColumn('services', 'is_service')) {
                $table->string('is_service')->after('key_name')->comment("0 - Not/ 1 - Yes");
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
        Schema::table('services', function (Blueprint $table) {
            if (Schema::hasColumn('services', 'key_name')) {
                $table->dropColumn('key_name');
            }

            if (Schema::hasColumn('services', 'is_service')) {
                $table->dropColumn('is_service');
            }
        });
    }
}
