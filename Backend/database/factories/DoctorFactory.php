<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
                   'user_id' => function () {
                       return User::factory()->create()->id;
                   },
                   'username' => $this->faker->unique()->userName,
                   'name' => $this->faker->nickname,
                   'staff_type' => $this->faker->randomElement(['Doctor', 'patient']),
                   'specialty' => $this->faker->randomElement(['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics']),
                   'num_rate' => 0,
                   'age' => $this->faker->numberBetween(25, 65),
                   'rate' => 0,
                   'current_hospital' => $this->faker->company,
                   'graduation_year' => $this->faker->year,
                   'experience_years' => $this->faker->numberBetween(1, 20),
                   'experiences' => $this->faker->paragraph,
                   'about' => $this->faker->paragraph,
                   'salary' => $this->faker->randomFloat(2, 5000, 20000),
                   'certificate_count' => $this->faker->numberBetween(0, 10),
                   'type' => $this->faker->randomElement(['Full-Time', 'Part-Time']),
                   'created_at' => Carbon::now(),
                   'updated_at' => Carbon::now(),

        ];
    }
}
