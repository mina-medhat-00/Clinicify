<?php
namespace Database\Factories;

use App\Models\Appointment;
use App\Models\User;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
/**
* The name of the factory's corresponding model.
*
* @var string
*/
protected $model = Appointment::class;

/**
* Define the model's default state.
*
* @return array
*/
public function definition()
{

$scheduleDate = $this->faker->date();
$duration = $this->faker->numberBetween(15, 120);
$appointmentFees = $this->faker->numberBetween(50, 500);
$appointmentType = $this->faker->randomElement(['chat', 'InClinic']);
$rate = $this->faker->optional(0.7, null)->randomFloat(2, 1, 5);
$slotTime = $this->faker->time();
$feedback = $this->faker->optional(0.5)->sentence();
$appointmentState = $this->faker->randomElement(['free', 'booked', 'running', 'done']);

return [
'booked_time' => null,
    'schedule_from' => User::create()->id,
    'booked_from' => User::create()->id,
'schedule_date' => $scheduleDate,
'duration' => $duration,
'appointmentFees' => $appointmentFees,
'appointment_type' => $appointmentType,
'rate' => $rate,
'slot_time' => $slotTime,
'feedback' => $feedback,
'appointment_state' => $appointmentState,
];
}
}
