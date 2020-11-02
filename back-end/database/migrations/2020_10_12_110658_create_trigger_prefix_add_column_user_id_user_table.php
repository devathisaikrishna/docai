<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTriggerPrefixAddColumnUserIdUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', '_user_id')) {
                    $table->string('_user_id',255)->nullable()->after('id')->comment('auto genrate _user_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `users_before_insert__user_id`');
            DB::unprepared("CREATE TRIGGER `users_before_insert__user_id` BEFORE INSERT ON `users` FOR EACH ROW
            IF NEW._user_id IS NULL or NEW._user_id='' THEN
            SET NEW._user_id = (SELECT CONCAT('U',(COALESCE((SELECT id FROM users ORDER BY id DESC LIMIT 1),0) + 1)+10000));
            END IF;");
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', '_user_id')) {
                    $table->dropColumn('_user_id');
                }
            });
            DB::unprepared('DROP TRIGGER IF EXISTS `users_before_insert__user_id`');
        }
    }
}
