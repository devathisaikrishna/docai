<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceLogs extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('service_logs', function (Blueprint $table) {
            $table->id();
            $table->text('token');
            $table->string('project_id', 255)->comment('oauth_clients.id');
            $table->foreignId('service_id')->constrained('services');
            $table->string("requested_file_path", 255);
            $table->text("ai_response");
            $table->string("ai_response_status", 10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('service_logs');
    }
}
