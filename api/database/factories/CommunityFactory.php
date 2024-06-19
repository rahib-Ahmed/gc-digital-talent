<?php

namespace Database\Factories;

use App\Models\Community;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Community::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->company();
        $description = $this->faker->sentence();

        return [
            'key' => $this->faker->slug(2),
            'name' => ['en' => $name.' EN', 'fr' => $name.' FR'],
            'description' => ['en' => $description.' EN', 'fr' => $description.' FR'],
        ];
    }

    /**
     * Attach the users to the related community as recruiters.
     * Creates a new user if no userIds passed in.
     *
     * @param  array|null  $userIds  - Id of the users to attach the role to
     * @return void
     */
    public function withCommunityRecruiters(?array $userIds = null)
    {
        return $this->afterCreating(function (Community $community) use ($userIds) {
            if (is_null($userIds) || count($userIds) === 0) {
                $community->addCommunityRecruiters(Community::factory()->create()->id);
            } else {
                foreach ($userIds as $userId) {
                    $community->addCommunityRecruiters($userId);
                }
            }
        });
    }

    /**
     * Attach the users to the related community as admins.
     * Creates a new user if no userIds passed in.
     *
     * @param  array|null  $userIds  - Id of the users to attach the role to
     * @return void
     */
    public function withCommunityAdmins(?array $userIds = null)
    {
        return $this->afterCreating(function (Community $community) use ($userIds) {
            if (is_null($userIds) || count($userIds) === 0) {
                $community->addCommunityAdmins(Community::factory()->create()->id);
            } else {
                foreach ($userIds as $userId) {
                    $community->addCommunityAdmins($userId);
                }
            }
        });
    }
}
