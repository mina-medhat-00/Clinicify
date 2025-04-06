<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Feedback;
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


class FeedbackTest extends TestCase
{
    use RefreshDatabase; // Ensure the database is refreshed for each test

    /** @test */
    public function it_adds_feedback_successfully_when_user_is_authenticated()
    {
        // Create a user and simulate authentication
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
        $feed = Feedback::create([
            'feedback_from' => 1,
            'feedback_to' => 2,
            'feedback' => 'Great service!',
        ]);
        $this->actingAs($user1);

        // Create a fake feedback data
        $feedbackData = [
            'rate' => 5,
            'feedback' => 'Great service!',
            'feedback_to' => $user2->id,
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/feedback', ['data' => $feedbackData]);

        // Assert the response
        $response->assertStatus(200);

        // Assert that the feedback was stored in the database
        $this->assertDatabaseHas('feedback', [
            'feedback_from' =>1,
            'feedback_to' => 2,
            'rate' => 5,
            'feedback' => $feedbackData['feedback'],
        ]);
    }

    /** @test */
    public function it_returns_unauthorized_error_when_user_is_not_authenticated()
    {

        // Create a fake feedback data
        $feedbackData = [
            'rate' => 5,
            'feedback' => 'Great service!',
            'feedback_to' => 1,
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/feedback', ['data' => $feedbackData]);

        // Assert the response
        $response->assertStatus(401);

    }

}
