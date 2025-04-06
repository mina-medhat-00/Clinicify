<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Jetstream\Features;
use Laravel\Jetstream\Http\Livewire\ApiTokenManager;
use Livewire\Livewire;
use Tests\TestCase;

class AuthTest  extends TestCase
{
    use RefreshDatabase;

    public function testAddUser_register_a_new_user_patient_or_doctor()
    {
        // Generate fake input data using factory
        $userData = User::factory()->make()->toArray();

        // Send a POST request to the adduser endpoint
        $response = $this->post('api/adduser', ['data' => $userData]);

        // Assert the response status code
        $response->assertStatus(200);

        // Assert the response structure
        $response->assertJsonStructure([
            'state',
            'message',
            'data' => [
                'user_id',
            ],
        ]);

        // Assert the database records
        $this->assertDatabaseHas('users', [
            'username' => $userData['username'],
        ]);

        if ($userData['userType'] === 'doctor') {
            $this->assertDatabaseHas('doctors', [
                'username' => $userData['username'],
            ]);
        }
    }
    public function testDoctors_Show_All_verified_doctors()
    {

        $response = $this->get('api/doctors');

        // Assert the response status code
        $response->assertStatus(200);

        // Assert the response structure
        $response->assertJsonStructure([
            'state',
            'message',
            'data' => [
            ],
        ]);

    }
}
