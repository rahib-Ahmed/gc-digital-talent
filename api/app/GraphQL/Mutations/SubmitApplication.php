<?php

namespace App\GraphQL\Mutations;

use App\Events\ApplicationSubmitted;
use App\GraphQL\Validators\Mutation\SubmitApplicationValidator;
use App\Models\PoolCandidate;
use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class SubmitApplication
{
    /**
     * Submit an application
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        // grab the specific application
        // submit to validator the PoolCandidate model
        $application = PoolCandidate::find($args['id']);
        $submitValidator = new SubmitApplicationValidator($application);
        // We haven't saved the signature yet, so manually add it to the array
        $application['signature'] = $args['signature'];
        $validator = Validator::make($application->toArray(), $submitValidator->rules(), $submitValidator->messages());
        if ($validator->fails()) {
            throw new ValidationException($validator->errors()->first(), $validator);
        }

        // all validation has successfully completed above, execute the core function of this resolver
        // add signature and submission, as well as update the set expiry date and status, update([]) not used due to not working correctly
        $dateNow = Carbon::now();
        $application->submitted_at = $dateNow;
        $application->pool_candidate_status = ApiEnums::CANDIDATE_STATUS_NEW_APPLICATION;
        $application->setInsertSubmittedStepAttribute(ApiEnums::APPLICATION_STEP_REVIEW_AND_SUBMIT);

        $success = $application->save();

        ApplicationSubmitted::dispatchIf($success, $application);

        return $application;
    }
}
