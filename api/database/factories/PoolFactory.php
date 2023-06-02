<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Pool;
use App\Models\Skill;
use App\Models\User;
use App\Models\Team;
use App\Models\ScreeningQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\KeyStringHelpers;
use Database\Helpers\ApiEnums;

class PoolFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pool::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->company();
        $isRemote = $this->faker->boolean();
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'key' => KeyStringHelpers::toKeyString($name),
            'user_id' => User::factory(),
            'team_id' => Team::factory(),
            'operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
            'key_tasks' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
            'your_impact' => ['en' => $this->faker->paragraph() . ' EN', 'fr' => $this->faker->paragraph() . ' FR'],
            'published_at' => $this->faker->boolean() ? $this->faker->dateTimeBetween('-30 days', '-1 days') : null,
            'closing_date' => $this->faker->dateTimeBetween('-1 months', '1 months'),
            'security_clearance' => $this->faker->randomElement(ApiEnums::poolSecurity()),
            'advertisement_language' => $this->faker->randomElement(ApiEnums::poolLanguages()),
            'advertisement_location' => !$isRemote ? ['en' => $this->faker->country(), 'fr' => $this->faker->country()] : null,
            'is_remote' => $isRemote,
            'stream' => $this->faker->optional->randomElement(ApiEnums::poolStreams()),
            'process_number' => $this->faker->optional->word(),
            'publishing_group' => $this->faker->optional->randomElement(ApiEnums::publishingGroups())
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Pool $pool) {
            $classifications = Classification::inRandomOrder()->limit(1)->get();
            $skills = Skill::inRandomOrder()->limit(10)->get();
            $pool->classifications()->saveMany($classifications);
            $pool->essentialSkills()->saveMany($skills->slice(0, 5));
            $pool->nonessentialSkills()->saveMany($skills->slice(5, 5));

            if (isset($pool->published_at)) {
                $pool->stream = $this->faker->randomElement(ApiEnums::poolStreams());
                $pool->save();
            }

            ScreeningQuestion::factory()
                ->count(3)
                ->sequence(
                    ['sort_order' => 1],
                    ['sort_order' => 2],
                    ['sort_order' => 3],
                )
                ->create(['pool_id' => $pool->id]);
        });
    }
}
