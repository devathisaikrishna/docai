<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTriggerPrefixAutoColumnAddAdminIdAdminTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS `admins_before_insert__admin_id`');
        DB::unprepared("CREATE TRIGGER `admins_before_insert__admin_id` BEFORE INSERT ON `admins` FOR EACH ROW
        IF NEW._admin_id IS NULL or NEW._admin_id='' THEN
          SET NEW._admin_id = (SELECT CONCAT('A',(COALESCE((SELECT id FROM admins ORDER BY id DESC LIMIT 1),0) + 1)+10000));
          END IF;");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS `admins_before_insert__admin_id`');
    }
}
