<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\CmoAsset;
use App\Models\Pool;
use App\Models\User;
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
        return [
            'name' => ['en' => $name, 'fr' => $name],
            'key' => KeyStringHelpers::toKeyString($name),
            'description' => ['en' => $this->faker->paragraph(), 'fr' => $this->faker->paragraph()],
            'user_id' => User::factory(),
            'operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
            'key_tasks' => ['en' => $this->faker->paragraph().' EN', 'fr' => $this->faker->paragraph().' FR'],
            'pool_status' => $this->faker->randomElement([
                'TAKING_APPLICATIONS',
                'NOT_TAKING_APPLICATIONS',
            ]),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Pool $pool) {
            $assets = CmoAsset::inRandomOrder()->limit(4)->get();
            $classifications = Classification::where('group', 'IT')->inRandomOrder()->limit(3)->get();
            $pool->essentialCriteria()->saveMany($assets->slice(0,2));
            $pool->assetCriteria()->saveMany($assets->slice(2,2));
            $pool->classifications()->saveMany($classifications);
        });
    }
}
