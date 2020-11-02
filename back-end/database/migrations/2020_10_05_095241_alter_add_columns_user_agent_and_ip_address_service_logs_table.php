<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAddColumnsUserAgentAndIpAddressServiceLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('service_logs', function (Blueprint $table) {
            $table->string('request_domain')->nullable()->after('requested_file_path');
            $table->string('ip_address', 45)->nullable()->after('request_domain');
            $table->text('user_agent')->nullable()->after('ip_address');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('service_logs', function (Blueprint $table) {
            $table->dropColumn('request_domain');
            $table->dropColumn('ip_address');
            $table->dropColumn('user_agent');
        });
    }
}
