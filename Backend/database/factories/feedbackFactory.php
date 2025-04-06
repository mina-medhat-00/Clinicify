<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\feedback>
 */
class feedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition()
    {
        return [
            'feedback_from' => User::factory()->create()->id,
            'feedback_to' => Doctor::factory()->create()->user_id,
            'rate' => $this->faker->numberBetween(1, 5),
            'feedback' => $this->faker->paragraph,
        ];
    }
}
