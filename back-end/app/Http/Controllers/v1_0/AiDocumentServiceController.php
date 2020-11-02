<?php

namespace App\Http\Controllers\v1_0;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Service_log;
use App\Models\User_plan;
use App\Traits\CommonMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Validator;
use \Laravel\Passport\Token;
use \Lcobucci\JWT\Parser;

class AiDocumentServiceController extends Controller
{
    use CommonMethod;

    protected function validate_service_request(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'service_type' => ['required'],
            'file' => 'required|mimes:pdf,jpeg,jpg,png,docx,doc|max:5120',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return ["status" => true, "error" => $this->simplfyError($errors)];
        }

        $User_plan_obj = new User_plan();
        $u_plan = $User_plan_obj->check_permission_to_access_service($user->id, $request->service_type);

        if (empty($u_plan)) {
            return ["status" => true, "error" => "You have no active plan"];
        }

        if ((int) $u_plan["remaining_hit"] === 0) {
            return ["status" => true, "error" => "You exceed the limit of number of hits"];
        }
    }

    public function upload_document(Request $request)
    {
        #ref: https://github.com/laravel/passport/issues/124
        $bearerToken = $request->bearerToken();

        $tokenId = (new Parser())->parse($bearerToken)->getClaim('jti');
        $client = Token::find($tokenId)->client;

        $res = $this->validate_service_request($request);

        if ($res["status"]) {
            return response()->json(['error' => $res["error"]], 400);
        }

        $user = $request->user();
        $Service_log = new Service_log();

        $file_name = $request->file('file')->getClientOriginalName();

        $md5Name = md5_file($request->file('file')->getRealPath()) . rand(111111, 999999999);
        $path = $request->file('file')->storeAs(
            'services_files/' . $md5Name . '/',
            $file_name
        );

        $updated_path = Storage::disk('')->path($path);

        $response = Http::attach(
            'image',
            file_get_contents($updated_path),
            $file_name
        )->post('http://164.52.196.151:5000/upload');

        $Service_log->token = $request->bearerToken();
        $Service_log->project_id = $client->id;
        $Service_log->user_id = $user->id;
        $Service_log->service_id = Service::where("key_name", $request->service_type)->pluck("id")->first();
        $Service_log->requested_file_path = $request->path();
        $Service_log->request_domain = $_SERVER['HTTP_ORIGIN'] ?? '';
        $Service_log->ip_address = $request->getClientIp();
        $Service_log->user_agent = $request->server('HTTP_USER_AGENT');
        $Service_log->ai_response = json_encode($response->json());
        $Service_log->ai_response_status = $response->status();

        $Service_log->save();

        $User_plan = User_plan::select(["id", "remaining_hit"])
            ->where(["user_id" => $user->id])->user_current_plan()->first();

        User_plan::where("id", $User_plan->id)->update(["remaining_hit" => (((int) $User_plan->remaining_hit) - 1)]);

        // // Determine if the status code was >= 200 and < 300...
        if ($response->successful()) {
            return response()->json($response->json(), 200);
        }

        // // Determine if the status code was >= 400...
        if ($response->failed()) {
            return response()->json(["message" => "Something went wrong"], 400);
        }
    }
}
