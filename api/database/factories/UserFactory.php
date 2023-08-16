<?php

namespace Database\Factories;

use App\Models\AwardExperience;
use App\Models\User;
use App\Models\Classification;
use App\Models\CommunityExperience;
use App\Models\Department;
use App\Models\EducationExperience;
use App\Models\GenericJobTitle;
use App\Models\PersonalExperience;
use App\Models\Skill;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\ApiEnums;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $evaluatedLanguageAbility = [
            'X',
            'A',
            'B',
            'C',
            'E',
            'P',
        ];

        $randomDepartment = Department::inRandomOrder()->first();
        $randomClassification = Classification::inRandomOrder()->first();
        $isGovEmployee = $this->faker->boolean();
        $hasPriorityEntitlement = $this->faker->boolean(10);
        $hasBeenEvaluated = $this->faker->boolean();
        $isDeclared = $this->faker->boolean();

        $lookingEnglish = $this->faker->boolean();
        $lookingFrench = $this->faker->boolean();
        $lookingBilingual = $this->faker->boolean();
        if (!$lookingEnglish && !$lookingFrench && !$lookingBilingual) {
            $lookingEnglish = true;
        }

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'sub' => $this->faker->boolean(75) ? $this->faker->unique()->uuid() : null,
            'telephone' => $this->faker->e164PhoneNumber(),
            'preferred_lang' => $this->faker->randomElement(['en', 'fr']),
            'preferred_language_for_interview' => $this->faker->randomElement(['en', 'fr']),
            'preferred_language_for_exam' => $this->faker->randomElement(['en', 'fr']),
            'current_province' => $this->faker->randomElement([
                'BRITISH_COLUMBIA',
                'ALBERTA',
                'SASKATCHEWAN',
                'MANITOBA',
                'ONTARIO',
                'QUEBEC',
                'NEW_BRUNSWICK',
                'NOVA_SCOTIA',
                'PRINCE_EDWARD_ISLAND',
                'NEWFOUNDLAND_AND_LABRADOR',
                'YUKON',
                'NORTHWEST_TERRITORIES',
                'NUNAVUT',
            ]),
            'current_city' => $this->faker->city(),
            'looking_for_english' => $lookingEnglish,
            'looking_for_french' => $lookingFrench,
            'looking_for_bilingual' => $lookingBilingual,
            'bilingual_evaluation' => $hasBeenEvaluated ? $this->faker->randomElement([
                'COMPLETED_ENGLISH',
                'COMPLETED_FRENCH',
            ]) : 'NOT_COMPLETED',

            'comprehension_level' => $hasBeenEvaluated ? $this->faker->randomElement(
                $evaluatedLanguageAbility
            ) : null,
            'written_level' => $hasBeenEvaluated ? $this->faker->randomElement(
                $evaluatedLanguageAbility
            ) : null,
            'verbal_level' => $hasBeenEvaluated ? $this->faker->randomElement(
                $evaluatedLanguageAbility
            ) : null,
            'estimated_language_ability' => $hasBeenEvaluated ? null : $this->faker->randomElement([
                'BEGINNER',
                'INTERMEDIATE',
                'ADVANCED'
            ]),
            'is_gov_employee' => $isGovEmployee,
            'department' => $isGovEmployee && $randomDepartment ? $randomDepartment->id : null,
            'current_classification' => $isGovEmployee && $randomClassification ? $randomClassification->id : null,
            'is_woman' => $this->faker->boolean(),
            'has_disability' => $this->faker->boolean(),
            'is_visible_minority' => $this->faker->boolean(),
            'has_diploma' => $this->faker->boolean(90), // temporary fix for Cypress workflows
            'location_preferences' => $this->faker->randomElements(
                [
                    'TELEWORK',
                    'NATIONAL_CAPITAL',
                    'ATLANTIC',
                    'QUEBEC',
                    'ONTARIO',
                    'PRAIRIE',
                    'BRITISH_COLUMBIA',
                    'NORTH',
                ],
                3
            ),
            'location_exemptions' => "{$this->faker->city()}, {$this->faker->city()}, {$this->faker->city()}",
            'position_duration' => $this->faker->boolean() ?
                [ApiEnums::POSITION_DURATION_PERMANENT, ApiEnums::POSITION_DURATION_TEMPORARY]
                : [ApiEnums::POSITION_DURATION_PERMANENT], // always accepting PERMANENT
            'accepted_operational_requirements' => $this->faker->optional->randomElements(ApiEnums::operationalRequirements(), 2),
            'gov_employee_type' => $isGovEmployee ? $this->faker->randomElement(ApiEnums::govEmployeeTypes()) : null,
            'citizenship' => $this->faker->randomElement(ApiEnums::citizenshipStatuses()),
            'armed_forces_status' => $this->faker->randomElement(ApiEnums::armedForcesStatuses()),
            'has_priority_entitlement' => $hasPriorityEntitlement,
            'priority_number' => $hasPriorityEntitlement ? $this->faker->word() : null,
            'indigenous_declaration_signature' => $isDeclared ? $this->faker->firstName() : null,
            'indigenous_communities' => $isDeclared ? [$this->faker->randomElement(ApiEnums::indigenousCommunities())] : [],
            // mirroring migration where isIndigenous = false maps to []
        ];
    }

    public function withExperiences($count = 10)
    {
        $types = [
            AwardExperience::factory(),
            CommunityExperience::factory(),
            EducationExperience::factory(),
            PersonalExperience::factory(),
            WorkExperience::factory(),
        ];
        return $this->withSkills()->afterCreating(function (User $user) use ($types, $count) {
            for ($i = 0; $i < $count; $i++) {
                $type = $this->faker->randomElement($types);
                $type->create([
                    'user_id' => $user->id,
                ]);
            }
        });
    }

    /**
     * Skills must have already been generated.
     */
    public function withSkills($count = 10)
    {
        return $this->afterCreating(function (User $user) use ($count) {
            // If user has no experiences yet, create one.
            if (!$user->experiences->count()) {
                WorkExperience::factory()->create(['user_id' => $user->id]);
                $user->refresh();
            }

            // Take $count random skills and assign each to a random experience of this user.
            $skills = Skill::inRandomOrder()->take($count)->get();
            $experience = $this->faker->randomElement($user->experiences);
            $experience->syncSkills($skills);
        });
    }

    /**
     * Is government employee.
     */
    public function asGovEmployee($isGovEmployee = true)
    {
        return $this->state(function () use ($isGovEmployee) {
            if (!$isGovEmployee) {
                return [
                    'is_gov_employee' => false,
                    'current_classification' => null,
                    'gov_employee_type' => null,
                    'department' => null,

                ];
            }
            $randomClassification = Classification::inRandomOrder()->first();
            $randomDepartment = Department::inRandomOrder()->first();
            return [
                'is_gov_employee' => true,
                'current_classification' => $randomClassification ? $randomClassification->id : null,
                'gov_employee_type' => $this->faker->randomElement(ApiEnums::govEmployeeTypes()),
                'department' => $randomDepartment ? $randomDepartment->id : null,

            ];
        });
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('base_user');
        });
    }

    /**
     * Attach the guest role to a user after creation.
     *
     * @return $this
     */
    public function asGuest()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('guest');
        });
    }

    /**
     * Attach the applicant role to a user after creation.
     *
     * @return $this
     */
    public function asApplicant()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('applicant');
        });
    }

    /**
     * Attach the request responder role to a user after creation.
     *
     * @return $this
     */
    public function asRequestResponder()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('request_responder');
        });
    }

    /**
     * Attach the pool operator role to a user after creation.
     *
     * @param   string  $team   Name of the team to attach the role to
     *
     * @return $this
     */
    public function asPoolOperator(string|array $team)
    {
        return $this->afterCreating(function (User $user) use ($team) {
            if (is_array($team)) {
                foreach ($team as $singleTeam) {
                    $user->addRole("pool_operator", $singleTeam);
                }
            } else {
                $user->addRole("pool_operator", $team);
            }
        });
    }

    /**
     * Attach the admin role to a user after creation.
     *
     * @return $this
     */
    public function asAdmin()
    {
        return $this->afterCreating(function (User $user) {
            $user->addRole('platform_admin');
        });
    }
}
