<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Passport\Client as PassportClient;
use App\Models\Api_key_requests;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ApiKeyRequestController extends Controller
{
    function request_for_key(Request $request)
    {
        $user = $request->user();
        $apiKeyRequest = Api_key_requests::where(['user_id' => $user->id])->whereIn("status", [1, 2, 3])->first();

        if ($apiKeyRequest) {
            return response()->json(["error" => "Already requested"], 422);
        }

        $apiKeyRequest = new Api_key_requests();
        $apiKeyRequest->user_id = $user->id;
        $apiKeyRequest->save();
        return response()->json(["message" => "Your request for API sent successfully"], 200);
    }

    protected function genrate_key($userId)
    {
        $user = User::where("id", $userId)->first();
        $passportClient = PassportClient::where(["user_id" => $userId, "revoked" => 0])->first();

        if (!empty($passportClient)) {
            return ["client_id" => $passportClient->id, "secret" => $passportClient->secret];
        }

        $passportClient = new PassportClient();
        $passportClient->user_id =  $user->id;
        $passportClient->name =  $user->firstname . ' ' . $user->lastname;
        $passportClient->password_client = 1;
        $passportClient->personal_access_client   =  0;
        $passportClient->redirect =  'redirect_uri';
        $passportClient->revoked =  0;
        $passportClient->save(); // Saving oauth client

        return ["client_id" => $passportClient->id, "secret" => $passportClient->secret];
    }

    public function get_api_key(Request $request)
    {
        $user = $request->user();

        $apiRequest = Api_key_requests::where(['user_id' => $user->id])
            ->whereIn("status", [1, 2, 3])
            ->first();

        if (!$apiRequest) {
            return response()->json(["api_key_status" => 0], 200);
        }

        switch ($apiRequest->status) {
            case 1:
                $response = response()->json(["message" => "Your request is pending. Please wait until approve", "api_key_status" => $apiRequest->status], 200);
                break;
            case 2:
                $response = response()->json(["api_key_status" => $apiRequest->status], 200);
                break;
            case 3:
                $response = response()->json(["message" => "Sorry, Your request denied.", "api_key_status" => $apiRequest->status], 200);
                break;
            default:
                $response = response()->json(["api_key_status" => 0], 200);
                break;
        }

        return $response;
    }

    public function regenerate_api_key(Request $request)
    {
        $user = $request->user();

        $apiKeyRequest = Api_key_requests::where(['user_id' => $user->id])->whereIn("status", [1, 2, 3])->first();
        if (!$apiKeyRequest) {
            return response()->json(["error" => "Invalid request"], 401);
        }

        if ($apiKeyRequest->status === 1) {
            $response = response()->json(["message" => "Your request pending. Please wait until approve"], 401);
        } elseif ($apiKeyRequest->status === 3) {
            $response = response()->json(["message" => "Soory, Your request denied. Please contact to admin"], 401);
        } else {
            $secret = base64_encode(hash_hmac('sha256', Hash::make(rand()), 'secret', true));
            $secret = strtr(rtrim($secret, '='), '+/', '-_');
            PassportClient::where(["user_id" => $user->id, 'id' => $request->id, "revoked" => 0])->update(["secret" => $secret]);
            $response = response()->json(["secret_key" => $secret], 200);
        }
        return $response;
    }
}
