<?php

namespace Database\Factories;

use App\Models\PoolCandidate;
use App\Models\ScreeningQuestion;
use App\Models\ScreeningQuestionResponse;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScreeningQuestionResponseFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ScreeningQuestionResponse::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        return [
            'pool_candidate_id' => PoolCandidate::factory(),
            'screening_question_id' => ScreeningQuestion::factory(),
            'answer' => $this->faker->paragraph(),
        ];
    }
}
