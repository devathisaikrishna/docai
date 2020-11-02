<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "oauth_clients";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'secret',
        'provider',
        'redirect',
        'personal_access_client',
        'password_client',
        'revoked'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'string'
    ];

    /**
     * One to one relationship between users
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * One to many relationship between service logs
     *
     * @return void
     */
    public function service_logs()
    {
        return $this->hasMany(Service_log::class, 'project_id');
    }
}
