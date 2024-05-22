<?php

namespace Database\Seeders;

use App\Models\ApplicantFilter;
use App\Models\PoolCandidateSearchRequest;
use Illuminate\Database\Seeder;

class SearchRequestRandomSeeder extends Seeder
{
    /**
     * Seeds initial user records into that database.
     * These users are only useful for testing locally.
     *
     * @return void
     */
    public function run()
    {

        $applicantFilter = ApplicantFilter::factory()->sparse()->withRelationships(true)->create();

        // Create some SearchRequests
        PoolCandidateSearchRequest::factory()
            ->count(50)
            ->createQuietly([
                'community_id' => $applicantFilter->community_id,
                'applicant_filter_id' => $applicantFilter->id,
            ]);
    }
}
