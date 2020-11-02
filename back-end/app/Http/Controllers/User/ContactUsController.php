<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactUs;
use Illuminate\Database\QueryException;
use Validator;
use App\Traits\CommonMethod;
use Mail;
use App\Mail\ContactusMail;

class ContactUsController extends Controller
{
    use CommonMethod;
    public function contact(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:200',
            'email' => 'required|email|max:180',
            'phone' => 'required|min:10|max:18|regex:/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]{8,18}$/',
            'message' => 'required|max:300',
            ]);
            
        if ($validator->fails()) {
            $errors = $validator->errors()->getMessages();
            return response()->json(['error' => $this->simplfyError($errors)], 400);
        }

        $contact = new ContactUs;

        try{
            $contact->name = $request->name;
            $contact->email = $request->email;
            $contact->phone = $request->phone;
            $contact->message = $request->message;
            $contact->save();

            Mail::queue(new ContactusMail($contact));
            
            return response()->json(["success"=>"Successfully sent, We will contact you soon."], 200);
        } catch (QueryException $ex) {
            return \Response::json(["error" => $ex->getMessage()],400);
        }
    }
}

