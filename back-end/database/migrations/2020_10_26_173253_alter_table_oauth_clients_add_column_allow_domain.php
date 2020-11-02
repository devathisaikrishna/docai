<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableOauthClientsAddColumnAllowDomain extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('oauth_clients')) {
            Schema::table('oauth_clients', function (Blueprint $table) {
                if (!Schema::hasColumn('oauth_clients', 'allow_domain')) {
                    $table->text('allow_domain')->after('redirect')->nullable();
                }
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
        Schema::table('oauth_clients', function (Blueprint $table) {
            if (Schema::hasColumn('oauth_clients', 'allow_domain')) {
                $table->dropColumn('allow_domain');
            }
        });
    }
}
