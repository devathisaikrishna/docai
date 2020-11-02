<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSubscriptionsAddColumnRzCancelResponseAndCancelAt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('subscriptions')) {
            Schema::table('subscriptions', function (Blueprint $table) {
                if (!Schema::hasColumn('subscriptions', 'rz_cancel_response')) {
                    $table->text('rz_cancel_response')->after('rz_response')->nullable();
                }
                if (!Schema::hasColumn('subscriptions', 'cancel_at')) {
                    $table->timestamp('cancel_at', 0)->after('rz_cancel_response')->nullable();
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
        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn('subscriptions', 'rz_cancel_response')) {
                $table->dropColumn('rz_cancel_response');
            }
            if (Schema::hasColumn('subscriptions', 'cancel_at')) {
                $table->dropColumn('cancel_at');
            }
        });
    }
}
