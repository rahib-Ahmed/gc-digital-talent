<?php

use App\Models\AwardExperience;
use App\Models\GenericJobTitle;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use App\Models\Skill;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Nuwave\Lighthouse\Testing\RefreshesSchemaCache;
use Nuwave\Lighthouse\Testing\MakesGraphQLRequests;
use Tests\TestCase;
use Database\Helpers\ApiEnums;
use Database\Seeders\SkillFamilySeeder;
use Database\Seeders\SkillSeeder;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\WithFaker;

class PoolApplicationTest extends TestCase
{
    use RefreshDatabase;
    use MakesGraphQLRequests;
    use RefreshesSchemaCache;
    use WithFaker;

    protected $guestUser;
    protected $applicantUser;
    protected $teamUser;
    protected $responderUser;
    protected $uuid;
    protected $toBeDeleted;

    protected $unauthorizedMessage = 'This action is unauthorized.';

    protected $queryDocument =
    /** @lang GraphQL */
    '
        query poolCandidate($id: UUID!) {
            poolCandidate(id: $id) {
                status
            }
        }
    ';

    protected $createMutationDocument =
    /** @lang GraphQL */
    '
        mutation createApplication($userId: ID!, $poolId: ID!){
            createApplication(userId: $userId, poolId: $poolId) {
                user {
                    id
                }
                pool {
                    id
                }
                status
            }
        }
    ';

    protected $archiveMutationDocument =
    /** @lang GraphQL */
    '
        mutation archiveApplication($id: ID!) {
            archiveApplication(id: $id) {
                archivedAt
            }
        }
    ';

    protected $deleteMutationDocument =
    /** @lang GraphQL */
    '
        mutation deleteApplication($id: ID!) {
            deleteApplication(id: $id)
        }
    ';

    protected $submitMutationDocument =
    /** @lang GraphQL */
    '
        mutation submitTest($id: ID!, $sig: String!) {
            submitApplication(id: $id, signature: $sig) {
                submittedAt
                signature
                status
            }
        }
    ';

    protected function setUp(): void
    {
        parent::setUp();

        // Run necessary seeders
        $this->seed(ClassificationSeeder::class);
        $this->seed(GenericJobTitleSeeder::class);
        $this->seed(SkillFamilySeeder::class);
        $this->seed(SkillSeeder::class);
        $this->seed(RolePermissionSeeder::class);

        $this->setUpFaker();
        $this->bootRefreshesSchemaCache();

        $this->guestUser = User::factory()->create([
            'email' => 'guest-user@test.com',
            'sub' => 'guest-user@test.com',
        ]);
        $this->guestUser->syncRoles([
            "guest",
        ]);

        $this->applicantUser = User::factory()->create([
            'email' => 'applicant-user@test.com',
            'sub' => 'applicant-user@test.com',
        ]);
        $this->applicantUser->syncRoles([
            "guest",
            "base_user",
            "applicant"
        ]);
        // Add generic job title for submission
        $this->applicantUser->expectedGenericJobTitles()->sync([GenericJobTitle::first()->id]);

        $this->responderUser = User::factory()->create([
            'email' => 'request-responder-user@test.com',
            'sub' => 'request-responder-user@test.com',
        ]);
        $this->responderUser->syncRoles([
            "guest",
            "base_user",
            "applicant",
            "request_responder"
        ]);

        $team = Team::factory()->create([
            'name' => "pool-application-test-team",
        ]);
        $this->teamUser = User::factory()->create([
            'email' => 'team-user@test.com',
            'sub' => 'team-user@test.com',
        ]);
        $this->teamUser->syncRoles([
            "guest",
            "base_user",
            "applicant"
        ]);
        $this->teamUser->attachRole("pool_operator",  $team);
    }

    public function testApplicationCreation(): void
    {
        // create an unexpired Pool instance
        $pool = Pool::factory()->create([
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);

        $variables = [
            'userId' => $this->applicantUser->id,
            'poolId' => $pool->id
        ];

        $result = [
            'data' => [
                'createApplication' => [
                    'user' => [
                        'id' => $this->applicantUser->id,
                    ],
                    'pool' => [
                        'id' => $pool->id,
                    ],
                    'status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
                ]
            ]
        ];

        // Guest users cannot create applications
        $this->actingAs($this->guestUser, "api")
            ->graphQL($this->createMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Assert creating a pool application succeeds
        // returns DRAFT as a result of pool_candidate_status Accessor and unexpired pool
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);

        // rerun the query above, it should successfully return the same result
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);

        // despite running the query twice, only one PoolCandidate entry should exist
        // assert count of applications is equal to 1
        $applicationCollection = PoolCandidate::all();
        $applicationCollectionCount = count($applicationCollection);
        $this->assertEquals(1, $applicationCollectionCount);
    }

    public function testUserCannotApplyToDraftPool(): void
    {
        $pool = Pool::factory()->create([
            'id' => '3ecf840d-b0ed-4207-8fc4-f45c4a865eaf',
            'published_at' => null,
            'closing_date' => config('constants.far_future_date'),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);

        $variables = [
            'userId' => $this->applicantUser->id,
            'poolId' => $pool->id
        ];

        $result = [
            'data' => [
                'createApplication' => null
            ],
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_POOL_NOT_PUBLISHED,
            ]]
        ];

        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);
    }

    public function testUserCannotApplyToExpiredPool(): void
    {
        $pool = Pool::factory()->create([
            'id' => 'f755f7da-c490-4fe1-a1f0-a6c233796442',
            'published_at' => null,
            'closing_date' => config('constants.far_past_date'),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);

        $variables = [
            'userId' => $this->applicantUser->id,
            'poolId' => $pool->id
        ];

        $result = [
            'data' => [
                'createApplication' => null
            ],
            'errors' => [[
                'message' => ApiEnums::POOL_CANDIDATE_POOL_NOT_PUBLISHED,
            ]]
        ];

        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->createMutationDocument, $variables)
            ->assertJson($result);
    }

    public function testArchivingApplication(): void
    {
        // Create pool candidates
        $archivableApplication = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
            'submitted_at' => config('constants.past_date'),
            'user_id' => $this->applicantUser->id
        ]);

        // this one is archived
        $notArchivableApplication = PoolCandidate::factory()->create([
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_EXPIRED,
            'archived_at' => config('constants.past_date'),
            'submitted_at' => config('constants.past_date'),
            'user_id' => $this->applicantUser->id
        ]);

        // This user does not own the application so cannot archive
        $this->actingAs($this->guestUser, "api")
            ->graphQL($this->archiveMutationDocument, ["id" => $archivableApplication->id])
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Request responders may not archive applications they do not own
        $this->actingAs($this->responderUser, "api")
            ->graphQL($this->archiveMutationDocument, ["id" => $archivableApplication->id])
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // Owner can archive
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->archiveMutationDocument, ["id" => $archivableApplication->id])
            ->assertJson(
                fn (AssertableJson $json) =>
                $json->has(
                    'data',
                    fn ($json) =>
                    $json->has(
                        'archiveApplication',
                        fn ($json) =>
                        $json->whereType('archivedAt', 'string')
                    )
                )
            );


        // Owner cannot archive certain applications
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->archiveMutationDocument, ["id" => $notArchivableApplication->id])
            ->assertJson([
                'errors' => [[
                    'message' => 'AlreadyArchived',
                ]]
            ]);
    }

    public function testArchivingApplicationStatuses(): void
    {
        // array of statuses that should fail the test, as they should not allow archiving
        $statusesThatShouldFail = [
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
            ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            ApiEnums::CANDIDATE_STATUS_SCREENED_IN,
            ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            ApiEnums::CANDIDATE_STATUS_DRAFT,
            ApiEnums::CANDIDATE_STATUS_DRAFT_EXPIRED,
            ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
        ];

        $shared = [
            'user_id' => $this->applicantUser->id,
            'expiry_date' => config('constants.far_future_date'),
        ];
        $sharedSubmitted = [
            ...$shared,
            'submitted_at' => config('constants.past_date'),
        ];

        // Create pool candidates
        // submitted at statuses for ones other than draft/draft-expired, and future expiry dates for unexpired
        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[0],
            ...$sharedSubmitted
        ]);
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[1],
            ...$sharedSubmitted
        ]);
        $candidateThree = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[2],
            ...$sharedSubmitted
        ]);
        $candidateFour = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[3],
            ...$sharedSubmitted
        ]);
        $candidateFive = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[4],
            ...$sharedSubmitted
        ]);
        $candidateSix = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[5],
            ...$sharedSubmitted
        ]);
        $candidateSeven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[6],
            ...$sharedSubmitted
        ]);
        // these two are draft and draft-expired so no submitted_at and the latter expired
        $candidateEight = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[7],
            ...$shared
        ]);
        $candidateNine = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[8],
            ...$shared
        ]);
        $candidateTen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[9],
            ...$sharedSubmitted
        ]);
        $candidateEleven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[10],
            ...$sharedSubmitted
        ]);
        $candidateTwelve = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[11],
            ...$sharedSubmitted
        ]);

        $result = [
            'errors' => [[
                'message' => 'pool candidate status InvalidValueArchival',
            ]]
        ];

        // Assert un-expired object cannot be archived, 12 different ones that should fail
        // just running through each of them one at a time
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateOne->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateTwo->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateThree->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateFour->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateFive->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateSix->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateSeven->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateEight->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateNine->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateTen->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateEleven->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->archiveMutationDocument,
                ['id' => $candidateTwelve->id]
            )->assertJson($result);
    }

    public function testApplicationSubmit(): void
    {
        // pool with no essential skills
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        $submitArgs = [
            'id' => $newPoolCandidate->id,
            'sig' => 'SIGNED',
        ];

        // Assert users who do not own the pool candidate cannot submit
        $this->actingAs($this->guestUser, "api")
            ->graphQL($this->submitMutationDocument,  $submitArgs)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        $this->actingAs($this->teamUser, "api")
            ->graphQL($this->submitMutationDocument,  $submitArgs)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        $this->actingAs($this->responderUser, "api")
            ->graphQL($this->submitMutationDocument,  $submitArgs)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // make user incomplete
        $this->applicantUser->armed_forces_status = null;
        $this->applicantUser->save();

        // assert incomplete user cannot submit application
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->submitMutationDocument,  $submitArgs)->assertJson([
                'errors' => [[
                    'message' => ApiEnums::POOL_CANDIDATE_PROFILE_INCOMPLETE,
                ]]
            ]);

        // make user now complete
        $this->applicantUser->armed_forces_status = ApiEnums::ARMED_FORCES_VETERAN;
        $this->applicantUser->save();

        // assert complete user can submit application
        // mimicking testArchivingApplication() where the returned value is always dynamic therefore must test returned structure and type
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertJson(
                fn (AssertableJson $json) =>
                $json->has(
                    'data',
                    fn ($json) =>
                    $json->has(
                        'submitApplication',
                        fn ($json) =>
                        $json->has('signature')
                            ->has("status")
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );

        // assert user cannot re-submit application
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->submitMutationDocument, $submitArgs)
            ->assertJson([
                'errors' => [[
                    'message' => 'AlreadySubmitted',
                ]]
            ]);
    }

    public function testApplicationSubmitSignature(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert empty signature submission errors
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => '',
                ]
            )->assertJson([
                'errors' => [[
                    'message' => ApiEnums::POOL_CANDIDATE_SIGNATURE_REQUIRED,
                ]]
            ]);

        // assert null signature submission errors
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => null,
                ]
            )->assertJson([
                'errors' => [[
                    'message' => 'Variable "$sig" of non-null type "String!" must not be null.',
                ]]
            ]);

        // assert query above re-submitted with a filled signature field this time succeeds
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'SIGNATURE',
                ]
            )->assertJson(
                fn (AssertableJson $json) =>
                $json->has(
                    'data',
                    fn ($json) =>
                    $json->has(
                        'submitApplication',
                        fn ($json) =>
                        $json->has('submittedAt')
                            ->has("status")
                            ->has('signature')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationSubmitSkills(): void
    {
        // create a pool, attach one essential skill to it
        $newPool = Pool::factory()->create([
            'closing_date' => Carbon::now()->addDays(1),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);
        $essentialSkills = Skill::inRandomOrder()->limit(5)->get();
        $newPool->essentialSkills()->sync($essentialSkills);

        // create an experience with no skills, then attach it to the user
        AwardExperience::factory()->create([
            'user_id' => $this->applicantUser->id,
        ]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert user cannot submit application with missing essential skills
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'SIGNED',
                ]
            )->assertJson([
                'errors' => [[
                    'message' => ApiEnums::POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS,
                ]]
            ]);

        // create another experience, then attach it to the user, and then connect the essential skill to it
        $secondExperience = AwardExperience::factory()->create([
            'user_id' => $this->applicantUser->id,
        ]);
        $secondExperience->skills()->sync($essentialSkills);

        // assert user can now submit application as the essential skill is present
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'SIGNED',
                ]
            )->assertJson(
                fn (AssertableJson $json) =>
                $json->has(
                    'data',
                    fn ($json) =>
                    $json->has(
                        'submitApplication',
                        fn ($json) =>
                        $json->has('signature')
                            ->has("status")
                            ->has('submittedAt')
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationSubmitStatus(): void
    {
        $newPool = Pool::factory()->create([
            'closing_date' =>  Carbon::now()->addDays(1),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert status updated upon submission, and doesn't return DRAFT or EXPIRED
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJsonFragment([
                "status" => ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            ]);
    }

    public function testApplicationSubmitClosingDate(): void
    {
        //Closed Pool
        $newPool = Pool::factory()->create([
            'closing_date' =>  Carbon::now()->subDays(1),
            'advertisement_language' => ApiEnums::POOL_ADVERTISEMENT_ENGLISH, // avoid language requirements
        ]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
        ]);

        // assert status
        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJson([
                'errors' => [[
                    'message' => ApiEnums::POOL_CANDIDATE_POOL_CLOSED,
                ]]
            ]);

        $newPool->closing_date = Carbon::now()->addDays(1);
        $newPool->save();

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->submitMutationDocument,
                [
                    'id' => $newPoolCandidate->id,
                    'sig' => 'sign',
                ]
            )->assertJson(
                fn (AssertableJson $json) =>
                $json->has(
                    'data',
                    fn ($json) =>
                    $json->has(
                        'submitApplication',
                        fn ($json) =>
                        $json
                            ->has("signature")
                            ->has("status")
                            ->has("submittedAt")
                            ->whereType('submittedAt', 'string')
                    )
                )
            );
    }

    public function testApplicationDeletion(): void
    {
        $newPool = Pool::factory()->create([]);
        $newPool->essentialSkills()->sync([]);

        $newPoolCandidate = PoolCandidate::factory()->create([
            'user_id' => $this->applicantUser->id,
            'pool_id' => $newPool->id,
            'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_DRAFT,
            'expiry_date' => config('constants.far_future_date'),
        ]);

        $variables = ['id' => $newPoolCandidate->id];

        // Assert candidate exists
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->queryDocument, $variables)
            ->assertJson([
                "data" => [
                    "poolCandidate" => [
                        "status" => ApiEnums::CANDIDATE_STATUS_DRAFT,
                    ]
                ]
            ]);

        // Assert non-owners cannot delete application
        $this->actingAs($this->guestUser, "api")
            ->graphQL($this->deleteMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        $this->actingAs($this->teamUser, "api")
            ->graphQL($this->deleteMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        $this->actingAs($this->responderUser, "api")
            ->graphQL($this->deleteMutationDocument, $variables)
            ->assertGraphQLErrorMessage($this->unauthorizedMessage);

        // run deletion mutation and assert it returns true, indicating success
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->deleteMutationDocument, $variables)->assertJson([
                "data" => [
                    "deleteApplication" => "true",
                ]
            ]);

        // Assert candidate no longer exists
        $this->actingAs($this->applicantUser, "api")
            ->graphQL($this->queryDocument, $variables)
            ->assertJson([
                "data" => [
                    "poolCandidate" => null,
                ]
            ]);
    }

    public function testApplicationDeletionStatuses(): void
    {

        // RECYCLING FROM ABOVE TESTS
        // array of statuses that should fail the test, as they should not allow deletion
        $statusesThatShouldFail = [
            ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION,
            ApiEnums::CANDIDATE_STATUS_APPLICATION_REVIEW,
            ApiEnums::CANDIDATE_STATUS_SCREENED_IN,
            ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_APPLICATION,
            ApiEnums::CANDIDATE_STATUS_UNDER_ASSESSMENT,
            ApiEnums::CANDIDATE_STATUS_SCREENED_OUT_ASSESSMENT,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_UNAVAILABLE,
            ApiEnums::CANDIDATE_STATUS_QUALIFIED_WITHDREW,
            ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL,
            ApiEnums::CANDIDATE_STATUS_PLACED_TERM,
            ApiEnums::CANDIDATE_STATUS_PLACED_INDETERMINATE,
            ApiEnums::CANDIDATE_STATUS_EXPIRED,
            ApiEnums::CANDIDATE_STATUS_REMOVED,
        ];

        // Create pool candidates
        $candidateOne = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[0],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTwo = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[1],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateThree = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[2],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateFour = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[3],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateFive = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[4],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateSix = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[5],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateSeven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[6],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateEight = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[7],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateNine = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[8],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[9],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateEleven = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[10],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateTwelve = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[11],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.far_future_date'),
        ]);
        $candidateThirteen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[12],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
        ]);
        $candidateFourteen = PoolCandidate::factory()->create([
            'pool_candidate_status' => $statusesThatShouldFail[13],
            'user_id' => $this->applicantUser->id,
            'submitted_at' => config('constants.past_date'),
            'expiry_date' => config('constants.past_date'),
        ]);

        $result = [
            'errors' => [[
                'message' => 'pool candidate status InvalidValueDeletion',
            ]]
        ];

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateOne->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateTwo->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateThree->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateFour->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateFive->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateSix->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateSeven->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateEight->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateNine->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateTen->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateEleven->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateTwelve->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateThirteen->id]
            )->assertJson($result);

        $this->actingAs($this->applicantUser, "api")
            ->graphQL(
                $this->deleteMutationDocument,
                ['id' => $candidateFourteen->id]
            )->assertJson($result);
    }
}
