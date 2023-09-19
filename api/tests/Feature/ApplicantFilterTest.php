<?php

namespace Tests\Feature;

use App\Enums\LanguageAbility;
use App\Enums\PoolCandidateSearchStatus;
use App\Enums\PoolStream;
use App\Models\ApplicantFilter;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\PoolCandidateSearchRequest;
use App\Models\User;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\GenericJobTitleSeeder;
use Database\Seeders\PoolSeeder;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Tests\TestCase;

class ApplicantFilterTest extends TestCase
{
    use MakesGraphQLRequests;
    use RefreshDatabase;
    use RefreshesSchemaCache;

    protected $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bootRefreshesSchemaCache();

        $this->seed(RolePermissionSeeder::class);

        // Create super user we run tests as
        // Note: this extra user does change the results of a couple queries
        $this->adminUser = User::factory()
            ->asRequestResponder()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',
            ]);
    }

    /**
     * Transform an ApplicantFilter to an ApplicantFilterInput array.
     */
    protected function filterToInput(ApplicantFilter $filter)
    {
        $onlyId = function ($item) {
            return ['id' => $item->id];
        };

        return [
            'hasDiploma' => $filter->has_diploma,
            'equity' => [
                'isWoman' => $filter->is_woman,
                'hasDisability' => $filter->has_disability,
                'isIndigenous' => $filter->is_indigenous,
                'isVisibleMinority' => $filter->is_visible_minority,
            ],
            'languageAbility' => $filter->language_ability,
            'operationalRequirements' => $filter->operational_requirements,
            'locationPreferences' => $filter->location_preferences,
            'positionDuration' => $filter->position_duration,
            'skills' => $filter->skills->map($onlyId)->toArray(),
            'pools' => $filter->pools->map($onlyId)->toArray(),
            'qualifiedClassifications' => $filter->qualifiedClassifications->map(function ($classification) {
                return [
                    'group' => $classification->group,
                    'level' => $classification->level,
                ];
            })->toArray(),
            'qualifiedStreams' => $filter->qualified_streams,
        ];
    }

    protected function filterToCreateInput(ApplicantFilter $filter)
    {
        $input = $this->filterToInput($filter);
        $input['skills'] = [
            'sync' => $filter->skills->pluck('id')->toArray(),
        ];
        $input['pools'] = [
            'sync' => $filter->pools->pluck('id')->toArray(),
        ];
        $input['qualifiedClassifications'] = [
            'sync' => $filter->qualifiedClassifications->pluck('id')->toArray(),
        ];

        return $input;
    }

    /**
     * Test that querying all ApplicantFilter returns correct number, with correct attributes.
     *
     * @return void
     */
    public function testQueryAllApplicantFilters()
    {
        $filters = ApplicantFilter::factory()->count(2)->create();

        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query {
                applicantFilters {
                    id
                    hasDiploma
                    equity {
                        isWoman
                        hasDisability
                        isIndigenous
                        isVisibleMinority
                    }
                    languageAbility
                    operationalRequirements
                    locationPreferences
                    positionDuration
                }
            }
        '
        );
        $response->assertJson([
            'data' => [
                'applicantFilters' => [
                    [
                        'id' => $filters[0]->id,
                        'hasDiploma' => $filters[0]->has_diploma,
                        'equity' => [
                            'isWoman' => $filters[0]->is_woman,
                            'hasDisability' => $filters[0]->has_disability,
                            'isIndigenous' => $filters[0]->is_indigenous,
                            'isVisibleMinority' => $filters[0]->is_visible_minority,
                        ],
                        'languageAbility' => $filters[0]->language_ability,
                        'operationalRequirements' => $filters[0]->operational_requirements,
                        'locationPreferences' => $filters[0]->location_preferences,
                        'positionDuration' => $filters[0]->position_duration,

                    ],
                    [
                        'id' => $filters[1]->id,
                        'hasDiploma' => $filters[1]->has_diploma,
                        'equity' => [
                            'isWoman' => $filters[1]->is_woman,
                            'hasDisability' => $filters[1]->has_disability,
                            'isIndigenous' => $filters[1]->is_indigenous,
                            'isVisibleMinority' => $filters[1]->is_visible_minority,
                        ],
                        'languageAbility' => $filters[1]->language_ability,
                        'operationalRequirements' => $filters[1]->operational_requirements,
                        'locationPreferences' => $filters[1]->location_preferences,
                        'positionDuration' => $filters[1]->position_duration,
                    ],
                ],
            ],
        ]);
    }

    /**
     * Test that querying a single ApplicantFilter returns the right one, with correct attributes.
     *
     * @return void
     */
    public function testQueryApplicantFilterById()
    {
        $filters = ApplicantFilter::factory()->count(3)->create();

        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query ($id: ID!) {
                applicantFilter(id: $id) {
                    id
                    hasDiploma
                    equity {
                        isWoman
                        hasDisability
                        isIndigenous
                        isVisibleMinority
                    }
                    languageAbility
                    operationalRequirements
                    locationPreferences
                    positionDuration
                }
            }
        ',
            [
                'id' => $filters[1]->id,
            ]
        );
        $response->assertJson([
            'data' => [
                'applicantFilter' => [
                    'id' => $filters[1]->id,
                    'hasDiploma' => $filters[1]->has_diploma,
                    'equity' => [
                        'isWoman' => $filters[1]->is_woman,
                        'hasDisability' => $filters[1]->has_disability,
                        'isIndigenous' => $filters[1]->is_indigenous,
                        'isVisibleMinority' => $filters[1]->is_visible_minority,
                    ],
                    'languageAbility' => $filters[1]->language_ability,
                    'operationalRequirements' => $filters[1]->operational_requirements,
                    'locationPreferences' => $filters[1]->location_preferences,
                    'positionDuration' => $filters[1]->position_duration,
                ],
            ],
        ]);
    }

    /**
     * Test that factory creates relationships correctly.
     */
    public function testFactoryRelationships()
    {
        // By default, factory doesn't add relationships.
        $filter = ApplicantFilter::factory()->create();

        $this->assertEquals(0, $filter->classifications()->count());
        $this->assertEquals(0, $filter->skills()->count());
        $this->assertEquals(0, $filter->pools()->count());

        // Before we add relationships, we need to seed the related values
        $this->seed(ClassificationSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(PoolSeeder::class);

        $filters = ApplicantFilter::factory()->withRelationships()->count(10)->create();
        $this->assertEquals(10, $filters->count());
        foreach ($filters as $filter) {
            $this->assertGreaterThan(0, $filter->classifications()->count());
            $this->assertGreaterThan(0, $filter->skills()->count());
            $this->assertGreaterThan(0, $filter->pools()->count());
        }
    }

    /**
     * Test that queried ApplicantFilters have the correct relationships.
     */
    public function testQueryRelationships()
    {
        // Before we add relationships, we need to seed the related values
        $this->seed(ClassificationSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(PoolSeeder::class);

        $filters = ApplicantFilter::factory()->withRelationships()->count(10)->create();
        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query {
                applicantFilters {
                    id
                    skills {
                        id
                        name {
                            en
                            fr
                        }
                    }
                    pools {
                        id
                        name {
                            en
                            fr
                        }
                    }
                    qualifiedStreams
                    qualifiedClassifications {
                        id
                        name {
                            en
                            fr
                        }
                    }
                }
            }
        '
        );
        // Assert that each relationship collection has the right size.
        foreach ($response->json('data.applicantFilters') as $filter) {
            $this->assertCount($filters->find($filter['id'])->qualifiedClassifications->count(), $filter['qualifiedClassifications']);
            $this->assertCount($filters->find($filter['id'])->skills->count(), $filter['skills']);
            $this->assertCount($filters->find($filter['id'])->pools->count(), $filter['pools']);
        }
        // Assert that the content of at least one item in each collection is correct.
        $firstFilter = $response->json('data.applicantFilters.0');
        $firstFilterModel = ApplicantFilter::where('id', $firstFilter['id'])->sole();
        $response->assertJson([
            'data' => [
                'applicantFilters' => [
                    [
                        'id' => $firstFilterModel->id,
                        'qualifiedClassifications' => [
                            [
                                'id' => $firstFilterModel->qualifiedClassifications->first()->id,
                                'name' => $firstFilterModel->qualifiedClassifications->first()->name,
                            ],
                        ],
                        'skills' => [
                            [
                                'id' => $firstFilterModel->skills->first()->id,
                                'name' => $firstFilterModel->skills->first()->name,
                            ],
                        ],
                        'pools' => [
                            [
                                'id' => $firstFilterModel->pools->first()->id,
                                'name' => $firstFilterModel->pools->first()->name,
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * Test that a PoolCandidateSearchRequest can be created, containing an ApplicantFilter
     */
    public function testCanCreateARequest()
    {
        // Seed everything required
        $this->seed(DepartmentSeeder::class);
        $this->seed(ClassificationSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);

        $filter = ApplicantFilter::factory()->withRelationships()->create();

        // make a request to pull fake data from - don't save it in DB.
        $request = PoolCandidateSearchRequest::factory()->make([
            'pool_candidate_filter_id' => null,
            'applicant_filter_id' => null,
        ]);
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            mutation createSearchRequest($request: CreatePoolCandidateSearchRequestInput!) {
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $request) {
                    id
                    email
                    fullName
                    jobTitle
                    managerJobTitle
                    positionType
                    status
                    department {
                        id
                    }
                }
            }
        ',
            [
                'request' => [
                    'fullName' => $request->full_name,
                    'email' => $request->email,
                    'department' => [
                        'connect' => $request->department_id,
                    ],
                    'jobTitle' => $request->job_title,
                    'managerJobTitle' => $request->manager_job_title,
                    'positionType' => $request->position_type,
                    'applicantFilter' => [
                        'create' => $this->filterToCreateInput($filter),
                    ],
                ],
            ]
        );
        $response->assertJson([
            'data' => [
                'createPoolCandidateSearchRequest' => [
                    'email' => $request->email,
                    'fullName' => $request->full_name,
                    'jobTitle' => $request->job_title,
                    'managerJobTitle' => $request->manager_job_title,
                    'positionType' => $request->position_type,
                    'status' => PoolCandidateSearchStatus::NEW->name,
                    'department' => [
                        'id' => $request->department_id,
                    ],
                ],
            ],
        ]);
    }

    /**
     * Test that we can use an ApplicantFilter in a search, save it as part of a PoolCandidateSearchRequest, retrieve it, and get the same results again.
     */
    public function testFilterCanBeStoredAndRetrievedWithoutChangingResults()
    {
        // Seed everything used in generating Users
        $this->seed(DepartmentSeeder::class);
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(PoolSeeder::class);

        $pool = Pool::factory()
            ->published()
            ->candidatesAvailableInSearch()
            ->create([
                'name' => [
                    'en' => 'Test Pool EN',
                    'fr' => 'Test Pool FR',
                ],
                'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
            ]);
        // Create candidates who may show up in searches
        $candidates = PoolCandidate::factory()->count(100)->availableInSearch()->create([
            'pool_id' => $pool->id,
            'user_id' => User::factory()->withSkills(10),
        ]);

        // Generate a filter that matches at least one candidate
        $candidate = $candidates->random();
        $filterLanguage = null; // run through fields and assign the enum for the first one that is true
        if ($candidate->looking_for_english) {
            $filterLanguage = LanguageAbility::ENGLISH->name;
        } elseif ($candidate->looking_for_french) {
            $filterLanguage = LanguageAbility::FRENCH->name;
        } elseif ($candidate->looking_for_bilingual) {
            $filterLanguage = LanguageAbility::BILINGUAL->name;
        }
        $filter = ApplicantFilter::factory()->create(
            [
                'has_diploma' => $candidate->user->has_diploma,
                'has_disability' => $candidate->user->has_disability,
                'is_indigenous' => $candidate->user->is_indigenous,
                'is_visible_minority' => $candidate->user->is_visible_minority,
                'is_woman' => $candidate->user->is_woman,
                'position_duration' => $candidate->user->position_duration,
                'language_ability' => $filterLanguage,
                'location_preferences' => $candidate->user->location_preferences,
                'operational_requirements' => $candidate->user->accepted_operational_requirements,
            ]
        );
        $filter->qualifiedClassifications()->saveMany(
            $pool->classifications->unique()
        );
        $candidateUser = User::with([
            'awardExperiences',
            'awardExperiences.skills',
            'communityExperiences',
            'communityExperiences.skills',
            'educationExperiences',
            'educationExperiences.skills',
            'personalExperiences',
            'personalExperiences.skills',
            'workExperiences',
            'workExperiences.skills',
        ])->find($candidate->user_id);
        $candidateSkills = $candidateUser->experiences->pluck('skills')->flatten()->unique();
        $filter->skills()->saveMany($candidateSkills->shuffle()->take(3));
        $filter->pools()->save($pool);
        $filter->qualified_streams = $pool->stream;
        $filter->save();
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => $this->filterToInput($filter),
            ]
        );
        // Sanity check - we should have at least one candidate in the filter.
        $firstCount = $response->json('data.countApplicants');
        $this->assertGreaterThan(0, $firstCount);

        // Store the filter with a search request

        // make a request to pull fake data from - don't save it in DB.
        $request = PoolCandidateSearchRequest::factory()->make([
            'pool_candidate_filter_id' => null,
            'applicant_filter_id' => null,
        ]);
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            mutation createSearchRequest($request: CreatePoolCandidateSearchRequestInput!) {
                createPoolCandidateSearchRequest(poolCandidateSearchRequest: $request) {
                    id
                }
            }
        ',
            [
                'request' => [
                    'fullName' => $request->full_name,
                    'email' => $request->email,
                    'department' => [
                        'connect' => $request->department_id,
                    ],
                    'jobTitle' => $request->job_title,
                    'managerJobTitle' => $request->manager_job_title,
                    'positionType' => $request->position_type,
                    'applicantFilter' => [
                        'create' => $this->filterToCreateInput($filter),
                    ],
                ],
            ]
        );
        $requestId = $response->json('data.createPoolCandidateSearchRequest.id');
        $response = $this->actingAs($this->adminUser, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query poolCandidateSearchRequest($id: ID!) {
                poolCandidateSearchRequest(id: $id) {
                    applicantFilter {
                        hasDiploma
                        equity {
                            isWoman
                            hasDisability
                            isIndigenous
                            isVisibleMinority
                        }
                        languageAbility
                        locationPreferences
                        operationalRequirements
                        positionDuration
                        qualifiedStreams
                        qualifiedClassifications {
                            group
                            level
                        }
                        skills {
                            id
                        }
                        pools {
                            id
                        }
                    }
                }
            }
        ',
            [
                'id' => $requestId,
            ]
        );
        $retrievedFilter = $response->json('data.poolCandidateSearchRequest.applicantFilter');

        // Now use the retrieved filter to get the same count
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => $retrievedFilter,
            ]
        );
        $this->assertEquals($firstCount, $response->json('data.countApplicants'));
    }
}
