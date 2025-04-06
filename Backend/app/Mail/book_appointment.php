<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class book_appointment extends Mailable
{
    use Queueable, SerializesModels;
    public $data;
    public $doctor;
    public $user;
    public $all_data;


    public function __construct($all_data,$doctor,$user)
    {
        $this->all_data=$all_data;
        $this->doctor=$doctor;
        $this->user=$user;
    }

    public function build()
    {
        return $this->subject('Your appointment is booked')->view('emails.booked')->with([['all_data'=>$this->all_data],['user'=>$this->user],['doctor'=>$this->doctor]]);
    }
}
