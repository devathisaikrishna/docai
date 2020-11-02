<?php

use App\Http\Controllers\User\ServiceLogsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\CouponsController;
use App\Http\Controllers\User\PlanController;
use App\Http\Controllers\User\ProjectsController;
use App\Http\Controllers\User\ApiKeyRequestController;
use App\Http\Controllers\User\UserPlanController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

$controller_prefix = "App\Http\Controllers\/";

// user api routes
Route::post('/user/login', 'App\Http\Controllers\User\LoginController@login');
Route::post('/register', 'App\Http\Controllers\User\RegisterController@register');
Route::get('/email/verify/{id}', 'App\Http\Controllers\User\VerificationController@verify')->name('verification.verify');
Route::post('/email/resend', 'App\Http\Controllers\User\VerificationController@resend')->name('verification.resend');
Route::post('/user/forgot_password', 'App\Http\Controllers\User\ForgotPasswordController@forgot_password');
Route::post('/user/reset_password', 'App\Http\Controllers\User\ForgotPasswordController@reset_password')->name("password.reset");
Route::post('/user/contact', 'App\Http\Controllers\User\ContactUsController@contact');


Route::group(['middleware' => ['auth.user', 'auth:api']], function () {
    Route::post('/user/logout', 'App\Http\Controllers\User\LoginController@logout');
    Route::post('/user/getProfile', 'App\Http\Controllers\User\UserController@getProfile');
    Route::post('/user/updateProfile', 'App\Http\Controllers\User\UserController@updateProfile');
    Route::post('/user/updatePassword', 'App\Http\Controllers\User\UserController@updatePassword');
    Route::post('/user/getReportFilter', 'App\Http\Controllers\User\ReportsController@getReportFilter');
    Route::post('/user/getReportOptionData', 'App\Http\Controllers\User\ReportsController@getReportInitialParam');

    Route::post('/user/request_for_key', [ApiKeyRequestController::class, 'request_for_key']);
    Route::post('/user/get_api_key', [ApiKeyRequestController::class, 'get_api_key']);
    Route::post('/user/regenerate_api_key', [ApiKeyRequestController::class, 'regenerate_api_key']);

    // User Projects Routes
    Route::post('/projects', [ProjectsController::class, 'index']);
    Route::post('/project', [ProjectsController::class, 'create']);
    Route::post('/project/edit', [ProjectsController::class, 'edit']);
    Route::post('/project/update', [ProjectsController::class, 'update']);
    Route::post('/project/show', [ProjectsController::class, 'show']);
    Route::post('/project/delete', [ProjectsController::class, 'destroy']);
    // Api Logs Routes
    Route::post('/service_logs', [ServiceLogsController::class, 'index']);
    Route::post('/service_logs/show', [ServiceLogsController::class, 'show']);

    // user plan
    Route::post('/user/get_current_plan', [UserPlanController::class, "get_current_plan"]);
    Route::post('/user/payments', [UserPlanController::class, "get_user_payments"]);
    Route::post('/get_all_plans',  [PlanController::class, "get_all_plans"]);

    Route::post('/user/add_to_cart', "App\Http\Controllers\User\CartController@add_to_cart");
    Route::post('/user/get_cart', "App\Http\Controllers\User\CartController@get_cart");

    Route::get('/user/get_all_country_option', "App\Http\Controllers\User\OrderController@get_all_country_option");
    Route::post('/user/order', "App\Http\Controllers\User\OrderController@order");
    Route::post('/user/save_payment_transaction_response', "App\Http\Controllers\User\OrderController@save_payment_transaction_response");
    Route::post('/user/redeem_coupon_code', "App\Http\Controllers\User\CouponController@redeem_coupon_code");
    Route::post('/update_plan', [UserPlanController::class, "update_plan"]);
});


// // ocr routing
Route::group(['middleware' => ['auth:api', 'scope:ai.document.service']], function () {
    Route::post('/service/ai_document', 'App\Http\Controllers\v1_0\AiDocumentServiceController@upload_document');
});


// webhook routing
Route::post('/webhook/subscription', 'App\Http\Controllers\Webhook\SubscriptionWebhookController@subscription');
Route::post('/webhook/payment', 'App\Http\Controllers\Webhook\PaymentWebhookController@payment');
