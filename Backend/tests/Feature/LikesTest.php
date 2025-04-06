<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Chat;
use App\Models\Doctor;
use App\Models\Feedback;
use App\Models\Like;
use App\Models\Post;
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


class LikesTest extends TestCase
{
    use RefreshDatabase; // Ensure the database is refreshed for each test

    /** @test */
    public function it_enable_authenticated_users_to_react_posts()
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
        $post = Post::create([
            'id'=>1,
            'user_id' => 1,
            'content' => "Please i need help",
        ]);

        $like = Like::create([
            'post_id' => 1,
            'user_id' => 2,
        ]);
        $this->actingAs($user2);

        // Create a fake feedback data
        $likeData = [
            'postId' => 1,
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/like', ['data' => $likeData]);

        // Assert the response
        $response->assertStatus(200);

        // Assert that the feedback was stored in the database
        $this->assertDatabaseHas('likes', [
            'post_id' => 1,
            'user_id' => 2,
        ]);
    }

    /** @test */
    public function it_returns_unauthorized_error_when_user_is_not_authenticated()
    {

        // Create a fake feedback data
        $likeData = [
            'postId' => 18,
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/like', ['data' => $likeData]);

        // Assert the response
        $response->assertStatus(401);

    }

}
