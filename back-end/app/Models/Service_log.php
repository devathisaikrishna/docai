<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service_log extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'token',
        'user_id',
        'project_id',
        'service_id',
        'requested_file_path',
        'ai_response',
        'request_domain',
        'ip_address',
        'user_agent',
        'ai_response_status',
    ];

    /**
     * One to one relationship between projects
     *
     * @return void
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'id');
    }
}
