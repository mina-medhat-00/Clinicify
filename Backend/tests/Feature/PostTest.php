<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Feedback;
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


class PostTest extends TestCase
{
    use RefreshDatabase; // Ensure the database is refreshed for each test

    /** @test */
    public function it_adds_posts_successfully_when_user_is_authenticated()
    {
        // Create a user and simulate authentication
        $user1 = User::create([
            "id"=>1,
            "username"=>"ahmed26",
            "password"=>"Aa111111",
            "user_type"=>"patient"
        ]);

        $post = Post::create([
            'id' => 1,
            'user_id'=>1,
            'content' => 'Great service!',
        ]);
        $this->actingAs($user1);

        // Create a fake feedback data
        $postData = [
            'content' => 'Great service!',
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/post', ['data' => $postData]);

        // Assert the response
        $response->assertStatus(200);

        // Assert that the feedback was stored in the database
        $this->assertDatabaseHas('posts', [
            'user_id' =>1,
            'content' => 'Great service!',

        ]);
    }

    /** @test */
    public function it_returns_unauthorized_error_when_user_is_not_authenticated()
    {

        // Create a fake feedback data
        $postData = [
            'id' => 1,
            'content' => 'Great service!',
        ];

        // Make a POST request to the add_feedback endpoint
        $response = $this->postJson('/api/submit/feedback', ['data' => $postData]);

        // Assert the response
        $response->assertStatus(401);

    }
    /** @test */

    public function it_shows_all_posts()
    {

        // Create a fake feedback data

        // Make a POST request to the add_feedback endpoint
        $response = $this->get('/api/get/posts');

        // Assert the response
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'state',
            'message',
            'data' => [

            ],
        ]);
    }

}
