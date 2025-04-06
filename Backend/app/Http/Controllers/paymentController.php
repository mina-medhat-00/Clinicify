<?php

namespace App\Http\Controllers;

use Error;
use Illuminate\Http\Request;


class paymentController extends Controller
{

    public function pay(Request $request){
        header('Content-Type: application/json');
        $stripeSecretKey="sk_test_51M9qWBLkzeNmV6Wx7H4pWNOFftLNYa2rCd5u3lFC8XEsApi8gMW0FW7zY4zNreicClve5Sj0Y7smYfCf3LcnbDk000lk8tZOuT";

        \Stripe\Stripe::setApiKey($stripeSecretKey);

        $jsonStr = file_get_contents('php://input');
        $jsonObj = json_decode($jsonStr);
        $all_data = ($request->input('data'));


        // Create a PaymentIntent with amount and currency
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => 5000,
            'currency' => 'usd',
            'description' => json_encode($all_data),
            'payment_method_types' => ['card'],
            'capture_method' => 'manual',
        ]);

        $output = [
            'clientSecret' => $paymentIntent->client_secret,
        ];

       // $pi=$paymentIntent->client_secret;
        //$intent = \Stripe\PaymentIntent::retrieve('pi_ANipwO3zNfjeWODtRPIg');
        //$intent->capture(['amount_to_capture' => 750]);
        echo json_encode($output);
    }
}
