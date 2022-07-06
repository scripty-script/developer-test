<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        /*
        $this->renderable(function (Throwable $e, $req) {
            if ($e instanceof MethodNotAllowedHttpException){
                return response()->json(['message' => 'Method Not Allowed' ], 405);
            }else if ($e instanceof NotFoundHttpException){
                return response()->json(['message' => '404 Not Found' ], 404);
            }

            $key = env('DEV', 'b39c7e3552e0cc956243719a01150eb5b75675c38ee312e36def6eb06cac7e10');
            
            if ($req->query('dev') === $key && $key !== null ) {
                return response()->json([
                    'message' => 'Something went wrong!',
                    'exception'=> [
                        'message'=>$e->getMessage(),
                        'stack_trace' => $e->getTrace() 
                    ]
                ], 500);
            }

            return response()->json(['message' => 'Something went wrong!'], 500);
        });
        */
    }
}
