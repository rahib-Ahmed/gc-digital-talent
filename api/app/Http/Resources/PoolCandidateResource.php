<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PoolCandidateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $awardExperiences = AwardExperienceResource::collection($this->awardExperiencesCriteria);
        $communityExperiences = CommunityExperienceResource::collection($this->communityExperiencesCriteria);
        $educationExperiences = EducationExperienceResource::collection($this->educationExperiencesCriteria);
        $personalExperiences = PersonalExperienceResource::collection($this->personalExperiencesCriteria);
        $workExperiences = WorkExperienceResource::collection($this->workExperiencesCriteria);

        $collection = collect();
        $collection = $collection->merge($awardExperiences);
        $collection = $collection->merge($communityExperiences);
        $collection = $collection->merge($educationExperiences);
        $collection = $collection->merge($personalExperiences);
        $collection = $collection->merge($workExperiences);

        return [
            'id' => $this->id,
            'status' => $this->pool_candidate_status,
            'expiryDate' => date('Y-m-d', strtotime($this->expiry_date)),
            'pool' => (new PoolResource($this->pool)),
            'minimumCriteria' => $this->minimum_criteria,
            'educationRequirementExperiences' => $collection,
        ];
    }
}
