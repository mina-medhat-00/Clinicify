<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Chat;
use App\Models\Doctor;
use App\Models\Feedback;
use App\Models\User;
use http\Message;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Laravel\Jetstream\Features;
use Laravel\Jetstream\Http\Livewire\ApiTokenManager;
use Livewire\Livewire;
use Tests\TestCase;


class ChatTest extends TestCase
{
    use RefreshDatabase; // Ensure the database is refreshed for each test

    /** @test */
    public function it_Create_new_chat_successfully_between_two_authenticated_users()
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
        $chat = Chat::create([
            'chat_from' => 1,
            'chat_to' => 2,
            'is_open' => true,
        ]);

        $mess = \App\Models\Message::create([
            'message_from' => 1,
            'message_to' => 2,
            'content' => "hello",
        ]);
        $this->actingAs($user1);

        // Create a fake feedback data
        $chatData = [
            'chat_from' => 1,
            'chat_to' => 2,
            'is_open' => true,
            'message_from' => 1,
            'message_to' => 2,
            'content' => "hello",
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/message', ['data' => $chatData]);

        // Assert the response
        $response->assertStatus(200);

        // Assert that the feedback was stored in the database
        $this->assertDatabaseHas('chats', [
            'chat_from' => 1,
            'chat_to' => 2,
            'is_open' => true,
        ]);
    }

    /** @test */
    public function it_returns_unauthorized_error_when_user_is_not_authenticated()
    {

        // Create a fake feedback data
        $chatData = [
            'chat_from' => 1,
            'chat_to' => 2,
            'is_open' => true,
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/message', ['data' => $chatData]);

        // Assert the response
        $response->assertStatus(401);

    }

}
