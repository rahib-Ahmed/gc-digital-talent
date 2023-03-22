<?php

namespace App\Console\Commands;

use App\Models\PoolCandidate;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Database\Helpers\ApiEnums;

class SubmittedAtApplicationDates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update-submitted-at';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'For pool candidates that should have submitted dates, submit them';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $dateNow = Carbon::now();
        $candidatesToSubmit = PoolCandidate::where('pool_candidate_status', ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION)
            ->where('submitted_at', null);

        foreach ($candidatesToSubmit as $candidate) {
            $candidate->update(['submitted_at' => $dateNow]);
        }

        return Command::SUCCESS;
    }
}
