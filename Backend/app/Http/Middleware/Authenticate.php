<?php

namespace App\Http\Middleware;


use Exception;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }




/*    protected function authenticate($request, array $guards)
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->guest()) {
                $state="not authorized to access";
                $message="cannot access to api resources";
                $data = [
                    'isUser'=>0
                ];
                return response(compact('state', 'message','data'),401);
            }
        }

        // Check if the bearer token is expired or null
        $token = $request->bearerToken();
        if (empty($token)) {
            $state="not authorized to access";
            $message="cannot access to api resources";
            $data = [
                'isUser'=>0
            ];
            return response(compact('state', 'message','data'),401);
        }
    }*/
}

