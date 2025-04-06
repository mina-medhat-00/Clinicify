<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Laravel\Jetstream\Features;
use Laravel\Jetstream\Http\Livewire\ApiTokenManager;
use Livewire\Livewire;
use Tests\TestCase;


class AppointmentTest extends TestCase
{
    use RefreshDatabase;
    /** @test */

    public function it_adds_new_appointments_successfully_when_user_is_authenticated()
    {
        // Create a user and simulate authentication
        $user1 = User::create([
            "id"=>1,
            "username"=>"ahmed262",
            "password"=>"Aa111111",
            "user_type"=>"doctor"
        ]);
        $Doctor = Doctor::create([
            "user_id"=>1,
            "username"=>"ahmed262",
            "password"=>"Aa111111",
            "user_type"=>"doctor"
        ]);
        $appointment = Appointment::create([
            'schedule_from' => 1,
            'schedule_date'=>"2024-02-26",
            'duration'=>3000000,
            'appointment_type'=>"chat",
            'slot_time' => '12:00 AM',
            'appointment_state' => 'free',
        ]);
        $this->actingAs($user1);
        // Create a fake appointment data
        $AppointmentData = [
            'schedule_from' => 1,
            'schedule_date'=>"2024-02-26",
            'duration'=>3000000,
            'appointment_type'=>"chat",
            'slot_time' => '12:00 AM',
            'appointment_state' => 'free',        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/schedule/appointments', ['data' => $AppointmentData]);

        // Assert the response
        $response->assertStatus(200);

        // Assert that the feedback was stored in the database
        $this->assertDatabaseHas('appointments', [
            'schedule_from' => 1,
            'schedule_date'=>"2024-02-26",
            'duration'=>3000000,
            'appointment_type'=>"chat",
            'slot_time' => '12:00 AM',
            'appointment_state' => 'free',

        ]);
    }
    /** @test */
    public function it_returns_all_slots()
    {

        $user1 = User::create([
            "id"=>1,
            "username"=>"ahmed26",
            "password"=>"Aa111111",
            "user_type"=>"patient"
        ]);
        $user2 = User::create([
            "id"=>2,
            "username"=>"ahmed262",
            "password"=>"Aa111111",
            "user_type"=>"doctor"
        ]);
        $Doctor = Doctor::create([
            "user_id"=>2,
            "username"=>"ahmed262",
            "password"=>"Aa111111",
            "user_type"=>"doctor"
        ]);
        $this->actingAs($user1);
        $SlotstData = [
            'date' => "2023-03-06",
            "doctorId"=>2
        ];
        $response = $this->postJson('/api/get/slots', ['data' => $SlotstData]);

        // Assert the response
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'state',
            'message',
            'data' => [
                'totalSlots',
                'bookedSlots',
                'freeSlots',
            ],
        ]);

    }
    /** @test */
    public function it_returns_unauthorized_error_when_user_is_not_authenticated()
    {

        // Create a fake feedback data
        $AppointmentData = [
            'schedule_from' => 1,
            'schedule_date'=>"2024-02-26",
            'duration'=>3000000,
            'appointment_type'=>"chat",
            'slot_time' => '12:00 AM',
            'appointment_state' => 'free',         ];

        $response = $this->postJson('/api/schedule/appointments', ['data' => $AppointmentData]);

        // Assert the response
        $response->assertStatus(401);

    }
}
