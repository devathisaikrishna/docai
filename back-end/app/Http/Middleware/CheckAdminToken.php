<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdminToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {

        if($request->user()->token()->name === "api-admin"){
            return $next($request);
        }else{
            return response()->json(["message" => "Unauthenticated"], 401);
        }
       
    }
}
