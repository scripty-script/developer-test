<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([ 'message' => $validator->errors()->all()], 400);
        }

        $validated = $validator->validated();
 
        if (Auth::attempt($validated)) {
            $request->session()->regenerate();
            
            return response()->noContent()->cookie('login', true);
        }

        return response()->json([ 'message' => 'The provided credentials do not match our records.'], 400);
    }
}