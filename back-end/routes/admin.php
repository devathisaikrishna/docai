<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ForgotPasswordController;
use App\Http\Controllers\Admin\CouponsController;
use App\Http\Controllers\Admin\KeysRequestController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserPlanController;

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/admin/login', [LoginController::class, 'login']);
Route::post('/admin/forgot_password', [ForgotPasswordController::class, 'forgotPassword']);

Route::group(['prefix' => '/admin', 'middleware' => ['auth.admin', 'auth:api-admin']], function () {

    Route::post('/logout', [LoginController::class, 'logout']);
    Route::post('/getprofile', [AdminController::class, "getProfile"]);
    Route::post('/profile', [AdminController::class, "updateProfile"]);
    Route::post('/update_password', [AdminController::class, "updatePassword"]);

    Route::post('/user_listing', [UserController::class, 'user_listing']);
    Route::post('/archive_user', [UserController::class, 'archive_user']);

    Route::post('/admin_user_listing', [AdminUserController::class, "index"]);
    Route::post('/get_admin_user', [AdminUserController::class, "getAdminUser"]);
    Route::post('/update_admin_user', [AdminUserController::class, "updateAdminUser"]);
    Route::post('/delete_admin_user', [AdminUserController::class, "delete"]);
    Route::post('/save_user', [AdminUserController::class, "create"]);

    Route::post('/api_key_request_listing', [KeysRequestController::class, 'api_key_request_listing']);
    Route::post('/approve_deny_key_request', [KeysRequestController::class, 'approve_deny_key_request']);

    Route::get('/get_services', "App\Http\Controllers\Admin\PlanController@get_system_services");
    Route::post('/save_plan', "App\Http\Controllers\Admin\PlanController@save_plan");
    Route::post('/get_plan_listing', [PlanController::class, "plan_listing"]);
    Route::post('/get_plan_options', [PlanController::class, "get_plan_options"]);
    Route::post('/allocate_plan_to_user', "App\Http\Controllers\Admin\UserPlanController@allocate_plan_to_user");
    Route::post('/archive_plan', "App\Http\Controllers\Admin\PlanController@archive_plan");
    Route::post('/get_plan_details', "App\Http\Controllers\Admin\PlanController@get_plan_details");

    // user subscription Routes
    Route::post('/user_plan_subscription_listing', [UserPlanController::class, 'get_user_plan_subscription_listing']);
    Route::post('/get_user_plan_subscription', "App\Http\Controllers\Admin\UserPlanController@get_user_plan_subscription");
    Route::post('/get_user_plan_subscription_payment_detail', "App\Http\Controllers\Admin\UserPlanController@get_user_plan_subscription_payment_detail");
    Route::post('/cancel_subscription_plan', "App\Http\Controllers\Admin\UserPlanController@cancel_subscription_plan");
    // Coupon Routes
    Route::post('/coupons', [CouponsController::class, 'index']);
    Route::post('/coupon/create', [CouponsController::class, 'store']);
    Route::post('/coupon/show', [CouponsController::class, 'show']);
    Route::post('/coupon/update', [CouponsController::class, 'update']);
    Route::post('/coupon/delete', [CouponsController::class, 'destroy']);
});
