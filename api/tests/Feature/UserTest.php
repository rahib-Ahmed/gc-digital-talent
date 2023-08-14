<?php

use App\Models\User;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\Classification;
use App\Models\Skill;
use App\Models\AwardExperience;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\WorkExperience;
use App\Models\GenericJobTitle;
use App\Models\Role;
use App\Models\UserSkill;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;
use Database\Seeders\ClassificationSeeder;
use Database\Seeders\GenericJobTitleSeeder;

class UserTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;

    // protected $requestResponder;
    protected $platformAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bootRefreshesSchemaCache();
        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->platformAdmin = User::factory()
            ->asAdmin()
            ->create([
                'email' => 'admin@test.com',
                'sub' => 'admin@test.com',

                // The following properties make sure this user doesn't match certain test queries, skewing results.
                'looking_for_english' => null,
                'looking_for_french' => null,
                'looking_for_bilingual' => null,
                'accepted_operational_requirements' => null,
                'location_preferences' => [],
                'has_diploma' => false,
                'position_duration' => [],
                'is_gov_employee' => false,
                'telephone' => null,
                'first_name' => null,
                'last_name' => null,
            ]);
    }

    public function testCreateUserDefaultRoles()
    {
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang
                    preferredLanguageForInterview
                    preferredLanguageForExam
                }
            }
        ',
            [
                'user' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    // If roles is not set, it should come back as empty array.
                ]
            ]
        )->assertJson([
            'data' => [
                'createUser' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'telephone' => null,
                    'preferredLang' => null,
                    'preferredLanguageForInterview' => null,
                    'preferredLanguageForExam' => null,
                ]
            ]
        ]);
        // Ensure user was saved
        $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
    }

    public function testCreateUserAdminRole()
    {
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            mutation CreateUser($user: CreateUserInput!) {
                createUser(user: $user) {
                    firstName
                    lastName
                    email
                    telephone
                    preferredLang
                    preferredLanguageForInterview
                    preferredLanguageForExam
                }
            }
        ',
            [
                'user' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                ]
            ]
        )->assertJson([
            'data' => [
                'createUser' => [
                    'firstName' => 'Jane',
                    'lastName' => 'Tester',
                    'email' => 'jane@test.com',
                    'telephone' => null,
                    'preferredLang' => null,
                    'preferredLanguageForInterview' => null,
                    'preferredLanguageForExam' => null,
                ]
            ]
        ]);
        // Ensure user was saved
        $this->assertDatabaseHas('users', ['email' => 'jane@test.com']);
    }

    public function testFilterByPoolCandidateStatuses(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);
        $pool2 = Pool::factory()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        PoolCandidate::factory()->count(4)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
        ]);
        PoolCandidate::factory()->count(3)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
        ]);
        PoolCandidate::factory()->count(2)->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => null,
        ]);
        PoolCandidate::factory()->count(1)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_REMOVED,
        ]);

        // Assert query with no pool filter will return all users, including unavailable
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 16
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter but no statuses filter
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, only expired status
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_EXPIRED],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, only removed status
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_REMOVED],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, expired + removed + available statuses
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_EXPIRED, ApiEnums::CANDIDATE_STATUS_REMOVED],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with pool filter, empty array of statuses will return all candidates in pool.
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $pool1['id'],
                            'statuses' => [],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 13
                    ]
                ]
            ]
        ]);

        // Assert query with unknown pool filter will return zero
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => '00000000-0000-0000-0000-000000000000',
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByCandidateExpiryDate(): void
    {
        // myPool will be people we're querying for and should be returned
        $myPool = Pool::factory()->create(['name' => 'myPool']);
        // otherPool will be people we're not querying for and should not be returned
        $otherPool = Pool::factory()->create(['name' => 'otherPool']);

        // Create some valid users in myPool, AVAILABLE status to ensure filter by pool only changes off expiry date in this test
        PoolCandidate::factory()->count(4)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // A candidate which expires today is not expired YET.
        PoolCandidate::factory()->create([
            'expiry_date' => date("Y-m-d"),
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // Candidates without expiry dates are considered active.
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => null,
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // Create some expired users in myPool
        PoolCandidate::factory()->count(2)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $myPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Create some valid users in otherPool
        PoolCandidate::factory()->count(5)->create([
            'expiry_date' => '3000-05-13',
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => date("Y-m-d"),
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        PoolCandidate::factory()->create([
            'expiry_date' => null,
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);
        // Create some expired users in otherPool
        PoolCandidate::factory()->count(3)->create([
            'expiry_date' => '2000-05-13',
            'pool_id' => $otherPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
        ]);

        // Assert query with no parameters returns all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        '
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 21 // 1 user from the pool factories + 20 from the pool candidate factories
                    ]
                ]
            ]
        ]);

        // Assert query with pool and expiryStatus ACTIVE returns correct users
        $response = $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $myPool->id,
                            'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ACTIVE,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        );
        $response->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query for pool without setting expiryStatus returns ACTIVE users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $myPool->id,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with pool and expiryStatus EXPIRED returns correct users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [

                            'poolId' => $myPool->id,
                            'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_EXPIRED,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with pool and expiryStatus ALL returns all users in pool
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'poolFilters' => [
                        [
                            'poolId' => $myPool->id,
                            'expiryStatus' => ApiEnums::CANDIDATE_EXPIRY_FILTER_ALL,
                            'statuses' => [ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE],
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByLanguageAbility(): void
    {
        User::factory()->count(1)->create([
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->count(4)->create([
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);

        // Create new LanguageAbility and attach to 3 new pool users.
        User::factory()->create([
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->create([
            'looking_for_english' => true,
            'looking_for_french' => false,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->create([
            'looking_for_english' => false,
            'looking_for_french' => false,
            'looking_for_bilingual' => true,
        ]);

        // Assert query with no LanguageAbility filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 9
                    ]
                ]
            ]
        ]);

        // Assert query with ENGLISH filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'languageAbility' => "ENGLISH"
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with FRENCH filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'languageAbility' => "FRENCH"
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with BILINGUAL filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'languageAbility' => "BILINGUAL"
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByOperationalRequirements(): void
    {
        // Create initial data.
        User::factory()->count(5)->create([
            'accepted_operational_requirements' => null,
        ]);
        $operationalRequirement1 = 'OVERTIME_SCHEDULED';
        $operationalRequirement2 = 'SHIFT_WORK';
        $operationalRequirement3 = 'ON_CALL';

        // Create a few with a op_req 1
        User::factory()->count(2)->create([
            'accepted_operational_requirements' => [$operationalRequirement1],
        ]);

        // Create a few with op_req 1 and 2
        User::factory()->count(2)->create([
            'accepted_operational_requirements' => [$operationalRequirement1, $operationalRequirement2],
        ]);

        // Assert query with no operationalRequirements filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with empty operationalRequirements filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => []
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 10
                    ]
                ]
            ]
        ]);

        // Assert query with one operationalRequirement filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [$operationalRequirement1],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert query with two operationalRequirement filters will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [$operationalRequirement1, $operationalRequirement2],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with an unused operationalRequirement filter will return zero
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'operationalRequirements' => [$operationalRequirement3],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByLocationPreferences(): void
    {
        // Create 5 new users with a ONTARIO location preference.
        User::factory()->count(5)->create([
            'location_preferences' => ["ONTARIO"],
        ]);

        // Create 2 new users with a TELEWORK location preference.
        User::factory()->count(2)->create([
            'location_preferences' => ["TELEWORK"],
        ]);

        // Assert query with no locationPreferences filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with locationPreferences filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'locationPreferences' => ["TELEWORK"],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with empty locationPreferences filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'locationPreferences' => [],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByDiploma(): void
    {
        // Create initial set of 5 users with no diploma.
        User::factory()->count(5)->create([
            'has_diploma' => false,
        ]);

        // Create two new users with a diploma.
        User::factory()->count(2)->create([
            'has_diploma' => true,
        ]);

        // Assert query no hasDiploma filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with hasDiploma filter set to true will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'hasDiploma' => true,
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with hasDiploma filter set to false will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'hasDiploma' => false,
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByAcceptTemporary(): void
    {
        // Create initial set of 5 users which wouldn't accept temporary.
        User::factory()->count(5)->create([
            'position_duration' => [ApiEnums::POSITION_DURATION_PERMANENT],
        ]);

        // Create two new users who would accept a temporary.
        User::factory()->count(2)->create([
            'position_duration' => [ApiEnums::POSITION_DURATION_TEMPORARY, ApiEnums::POSITION_DURATION_PERMANENT],
        ]);

        // Assert query no positionDuration filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with position duration filter set to temporary will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'positionDuration' => [ApiEnums::POSITION_DURATION_TEMPORARY],
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with position duration filter set to null will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'positionDuration' => null,
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByProfileComplete(): void
    {
        // need some generic job titles for a complete profile
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);

        // Create initial set of 5 users with incomplete profiles.
        User::factory()->count(5)->create([
            'current_province' => null,
            'location_preferences' => null,
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);

        // Create some partially complete users.
        User::factory()->count(2)->create([
            'current_province' => 'ONTARIO',
            'location_preferences' => null,
            'looking_for_english' => false,
            'looking_for_french' => true,
            'looking_for_bilingual' => false,
        ]);
        User::factory()->count(2)->create([
            'current_province' => 'ONTARIO',
            'location_preferences' => ['PRAIRIE'],
            'looking_for_english' => null,
            'looking_for_french' => null,
            'looking_for_bilingual' => null,
        ]);
        User::factory()->count(1)->create([
            'citizenship' => null,
            'armed_forces_status' => null,
        ]);

        // Create some complete users.
        User::factory()->count(3)
            ->create([
                'current_province' => 'ONTARIO',
                'location_preferences' => ['PRAIRIE'],
                'looking_for_english' => null,
                'looking_for_french' => true,
                'looking_for_bilingual' => null,
                'telephone' => '+15407608748',
                'current_city' => 'Somewhere random',
                'is_gov_employee' => false,
            ]);

        // Assert query no isProfileComplete filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14
                    ]
                ]
            ]
        ]);

        // Assert query with isProfileComplete filter set to true will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isProfileComplete' => true,
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);

        // Assert query with isProfileComplete filter set to false will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isProfileComplete' => false,
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 14
                    ]
                ]
            ]
        ]);
    }

    public function testFilterBySkillsIntersectional(): void
    {
        // Create initial data set
        Skill::factory()->count(20)->create();
        User::factory()->count(5)->create()->each(function ($user) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            EducationExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) {
                    $skills = Skill::inRandomOrder()->limit(3)->get();
                    $model->syncSkills($skills);
                })->create();
        });

        // Create a skill to test for
        $skill1 = Skill::factory()->create();
        $skill2 = Skill::factory()->create();
        $skill3 = Skill::factory()->create();
        User::factory()->afterCreating(function ($user) use ($skill1) {
            AwardExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
            WorkExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
        })->create();
        User::factory()->afterCreating(function ($user) use ($skill1, $skill2) {
            CommunityExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill1) {
                    $model->syncSkills([$skill1]);
                })->create();
            PersonalExperience::factory()
                ->for($user)
                ->afterCreating(function ($model) use ($skill2) {
                    $model->syncSkills([$skill2]);
                })->create();
        })->create();

        // Assert query no skills filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query empty skills filter array will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skills' => []
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with one skills filter will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skillsIntersectional' => [
                            ['id' => $skill1['id']]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with two skills will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skillsIntersectional' => [
                            ['id' => $skill1['id']],
                            ['id' => $skill2['id']]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert query with unused skill will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'skillsIntersectional' => [
                            ['id' => $skill3['id']]
                        ]
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testFilterByGovEmployee(): void
    {
        // Create initial set of 5 users not with gov.
        User::factory()->count(5)->create([
            'is_gov_employee' => false,
        ]);

        // Create two new users with the government.
        User::factory()->count(2)->create([
            'is_gov_employee' => true,
        ]);

        // Assert query no isGovEmployee filter will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);

        // Assert query with isGovEmployee filter set to true will return correct user count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isGovEmployee' => true,
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert query with isGovEmployee filter set to false will return all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'isGovEmployee' => false,
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 8
                    ]
                ]
            ]
        ]);
    }

    public function testOrdering(): void
    {
        // Create users for testing
        User::factory()->count(8)->create();
        $usersByName = User::select('id')->orderBy('first_name')->get()->toArray();
        $usersByCreated = User::select('id')->orderByDesc('created_at')->get()->toArray();

        // Assert query no orderBy given defaults to created_at desc
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    data {
                        id
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByCreated
                ]
            ]
        ]);

        // Assert query orders by given attribute
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($orderBy: [OrderByClause!]) {
                usersPaginated(orderBy: $orderBy) {
                    data {
                        id
                    }
                }
            }
        ',
            [
                'orderBy' => [
                    [
                        'column' => 'first_name',
                        'order' => 'ASC'
                    ]
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'data' => $usersByName
                ]
            ]
        ]);
    }

    public function testCountApplicantsQuery(): void
    {
        // Get the ID of the base admin user
        $user = User::All()->first();

        // Create new pools and attach to new pool candidates.
        $pool1 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id']
        ]);
        $pool2 = Pool::factory()->candidatesAvailableInSearch()->create([
            'user_id' => $user['id']
        ]);

        PoolCandidate::factory()->count(8)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ])
        ]);
        PoolCandidate::factory()->count(5)->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => false,
                'looking_for_french' => true,
                'looking_for_bilingual' => false,
            ])
        ]);
        // Should appear in searches, but in pool 2.
        PoolCandidate::factory()->create([
            'pool_id' => $pool2['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ])
        ]);
        // Expired in pool - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => '2000-01-01',
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ])
        ]);
        // Already placed - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ])
        ]);
        // User status inactive - should not appear in searches
        PoolCandidate::factory()->create([
            'pool_id' => $pool1['id'],
            'expiry_date' => config('constants.far_future_date'),
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            'user_id' => User::factory([
                'looking_for_english' => true,
                'looking_for_french' => false,
                'looking_for_bilingual' => false,
            ])
        ]);

        // Query specifying just a pool will return all non-expired, available-status candidates whose Users are looking for or open to opportunities.
        $response = $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ]
                ]
            ]
        );
        $response->assertJson([
            'data' => [
                'countApplicants' => 14 // including base admin user
            ]
        ]);

        // Assert query with another filter will return proper count
        $this->graphQL(
            /** @lang GraphQL */
            '
            query countApplicants($where: ApplicantFilterInput) {
                countApplicants (where: $where)
            }
        ',
            [
                'where' => [
                    'pools' => [
                        ['id' => $pool1['id']],
                    ],
                    'languageAbility' => ApiEnums::LANGUAGE_ABILITY_ENGLISH
                ]
            ]
        )->assertJson([
            'data' => [
                'countApplicants' => 9 //including base admin user
            ]
        ]);
    }

    public function testAdminTableFilter(): void
    {
        // Create 5 users
        User::factory()->create([
            'first_name' => 'bob',
            'last_name' => 'rob',
            'email' => "bob@user.com",
            'telephone' => "12345",
        ]);
        User::factory()->create([
            'first_name' => 'sam',
            'last_name' => 'ram',
            'email' => "sam@user.com",
            'telephone' => "67890",
        ]);
        User::factory()->create([
            'first_name' => 'dan',
            'last_name' => 'man',
            'email' => "dan@user.com",
            'telephone' => "99999",
        ]);
        User::factory()->create([
            'first_name' => 'sir',
            'last_name' => 'whir',
            'email' => "sir@user.com",
            'telephone' => "22222",
        ]);
        User::factory()->create([
            'first_name' => 'zak',
            'last_name' => 'pak',
            'email' => "zak@admin.com",
            'telephone' => "333333",
        ]);

        // Remember the admin user exists:
        // 'email' => 'admin@test.com',
        // 'sub' => 'admin@test.com',

        // Assert no filters returns all five users plus admin@test.com
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 6
                    ]
                ]
            ]
        ]);

        // Name filtering  //
        // casing should not matter
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'sAm',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
        // ensure single letter returns all relevant results
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'r',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 3
                    ]
                ]
            ]
        ]);
        // test a full name
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'BoB rOb',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
        // test name segments
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'bo ro',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);
        // test name segments but in reverse
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'ro bo',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // ensure queries with multiple filter variables apply separately as AND operations (builds off assertion above)
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'name' => 'r',
                    'telephone' => "12345",
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert email filter with partial email returns correct count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'email' => 'user.com',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 4
                    ]
                ]
            ]
        ]);

        // Assert filtering for phone digit in general search returns correct count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'generalSearch' => '9',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // Assert filtering for last name in general search returns correct count
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'generalSearch' => 'man',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 1
                    ]
                ]
            ]
        ]);

        // Assert filtering general search and name search (both subqueries) filter as AND
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'generalSearch' => '@user.com',
                    'name' => 'zak',
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 0
                    ]
                ]
            ]
        ]);
    }

    public function testNullFiltersEqualToUndefined(): void
    {
        // Create users to test filters on
        User::factory(60)->create();

        // Assert that using an empty (ie undefined) filter returns all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => []
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61
                    ]
                ]
            ]
        ]);

        // Assert that setting every value to null also returns all users
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => [
                    'applicantFilter' => [
                        'hasDiploma' => null,
                        'equity' => null,
                        'languageAbility' => null,
                        'operationalRequirements' => null,
                        'locationPreferences' => null,
                        'positionDuration' => null,
                        'skills' => null,
                        'pools' => null,
                    ],
                    'poolFilters' => null,
                    'isProfileComplete' => null,
                    'isGovEmployee' => null,
                    'telephone' => null,
                    'email' => null,
                    'name' => null,
                    'generalSearch' => null
                ]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 61
                    ]
                ]
            ]
        ]);
    }

    /** After running addSkills, the user should have a UserSkill for each added skill. */
    public function testAddSkillsAddsUserSkills(): void
    {
        $skills = Skill::factory(3)->create();
        $this->platformAdmin->addSkills($skills->pluck('id'));
        $userSkillSkillIds = $this->platformAdmin->userSkills->pluck('skill_id');
        $this->assertSameSize($skills, $userSkillSkillIds);
        foreach ($skills as $skill) {
            $this->assertContains($skill->id, $userSkillSkillIds);
        }
    }

    public function testAddSkillsRestoresSoftDeletedUserSkills(): void
    {
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id
        ]);
        $this->platformAdmin->userSkills->first()->delete();
        // The user skill should be trashed (soft-deleted) and by default shouldn't appear in results.
        $this->assertSoftDeleted($userSkill);
        $this->assertEmpty($this->platformAdmin->refresh()->userSkills);
        // Adding the same skill should restore the previous userSkill
        $this->platformAdmin->addSkills([$userSkill->skill_id]);
        $this->assertNotSoftDeleted($userSkill);
        $this->assertContains($userSkill->id, $this->platformAdmin->refresh()->userSkills->pluck('id'));
    }

    public function testAddSkillsDoesNotAddDuplicates(): void
    {
        $skills = Skill::factory(3)->create();
        // The user will already have the first skill.
        $userSkill = UserSkill::factory()->create([
            'user_id' => $this->platformAdmin->id,
            'skill_id' => $skills[0]->id
        ]);
        $addSkills = [
            $skills[0]->id, // This skill is already present
            $skills[1]->id,
            $skills[1]->id, // We will try to add this skill twice.
            $skills[2]->id,
        ];
        $this->platformAdmin->addSkills($addSkills);
        // After adding, user should still only have 3 userSkills.
        $this->assertCount(3, $this->platformAdmin->userSkills);
    }

    public function testRoleAssignmentScope(): void
    {
        $adminId = Role::where('name', 'platform_admin')->value('id');
        $responderId = Role::where('name', 'request_responder')->value('id');
        $operatorId = Role::where('name', 'pool_operator')->value('id');
        $testTeam = Team::factory()->create();

        // Create users
        User::factory(1)->asAdmin()->create();
        User::factory(3)->asGuest()->create();
        User::factory(5)->asPoolOperator($testTeam->name)->create();
        User::factory(7)->asRequestResponder()->create();
        User::factory(11)->asApplicant()->create();

        // Assert that null roleAssignments returns all users, including the one from setUp()
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => ['roles' => null]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 28
                    ]
                ]
            ]
        ]);

        // assert filtering for platform admin returns 2, including the one from setUp()
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
            query getUsersPaginated($where: UserFilterInput) {
                usersPaginated(where: $where) {
                    paginatorInfo {
                        total
                    }
                }
            }
        ',
            [
                'where' => ['roles' => [$adminId]]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 2
                    ]
                ]
            ]
        ]);

        // assert filtering for pool operator and request responder returns 12
        $this->actingAs($this->platformAdmin, 'api')->graphQL(
            /** @lang GraphQL */
            '
                    query getUsersPaginated($where: UserFilterInput) {
                        usersPaginated(where: $where) {
                            paginatorInfo {
                                total
                            }
                        }
                    }
                ',
            [
                'where' => ['roles' => [$operatorId, $responderId]]
            ]
        )->assertJson([
            'data' => [
                'usersPaginated' => [
                    'paginatorInfo' => [
                        'total' => 12
                    ]
                ]
            ]
        ]);
    }
}
