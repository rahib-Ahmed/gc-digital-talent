<?php

namespace App\GraphQL\Validators;

use App\Enums\DirectiveForms\ContractAuthority;
use App\Enums\DirectiveForms\ContractCommodity;
use App\Enums\DirectiveForms\ContractingRationale;
use App\Enums\DirectiveForms\ContractSupplyMethod;
use App\Enums\DirectiveForms\OperationsConsideration;
use App\Enums\DirectiveForms\PersonnelLanguage;
use App\Enums\DirectiveForms\PersonnelOtherRequirement;
use App\Enums\DirectiveForms\PersonnelScreeningLevel;
use App\Enums\DirectiveForms\PersonnelWorkLocation;
use App\Enums\DirectiveForms\YesNoUnsure;
use App\Rules\ArrayConsistentWithDetail;
use App\Rules\ScalarConsistentWithDetail;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class DigitalContractingQuestionnaireInput extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'readPreamble' => ['accepted'],
            'departmentOther' => [
                'required_without:department',
                Rule::prohibitedIf(! empty($this->arg('department'))),
            ],
            'businessOwnerEmail' => ['email'],
            'financialAuthorityEmail' => ['email'],
            'authoritiesInvolved' => [
                new ArrayConsistentWithDetail(ContractAuthority::OTHER->name, 'authorityInvolvedOther'),
            ],
            'contractEndDate' => ['after_or_equal:contractStartDate'],
            'commodityType' => [
                new ScalarConsistentWithDetail(ContractCommodity::OTHER->name, 'commodityTypeOther'),
            ],
            'methodOfSupply' => [
                new ScalarConsistentWithDetail(ContractSupplyMethod::OTHER->name, 'methodOfSupplyOther'),
            ],
            'requirementScreeningLevels' => [
                new ArrayConsistentWithDetail(PersonnelScreeningLevel::OTHER->name, 'requirementScreeningLevelOther'),
            ],
            'requirementWorkLanguages' => [
                new ArrayConsistentWithDetail(PersonnelLanguage::OTHER->name, 'requirementWorkLanguageOther'),
            ],
            'requirementWorkLocations' => [
                new ArrayConsistentWithDetail(PersonnelWorkLocation::OFFSITE_SPECIFIC->name, 'requirementWorkLocationSpecific'),
            ],
            'requirementOthers' => [
                new ArrayConsistentWithDetail(PersonnelOtherRequirement::OTHER->name, 'requirementOtherOther'),
            ],
            'personnelRequirements' => [
                'requiredIf:hasPersonnelRequirements,'.YesNoUnsure::YES->name,
                'prohibited_unless:hasPersonnelRequirements,'.YesNoUnsure::YES->name,
            ],
            'operationsConsiderations' => [
                new ArrayConsistentWithDetail(OperationsConsideration::OTHER->name, 'operationsConsiderationsOther'),
            ],
            'contractingRationalePrimary' => [
                Rule::notIn($this->arg('contractingRationalesSecondary')),
                new ScalarConsistentWithDetail(ContractingRationale::OTHER->name, 'contractingRationalePrimaryOther'),
            ],
            'contractingRationalesSecondary' => [
                new ArrayConsistentWithDetail(ContractingRationale::OTHER->name, 'contractingRationalesSecondaryOther'),
            ],
            'talentSearchTrackingNumber' => ['requiredIf:ocioConfirmedTalentShortage,'.YesNoUnsure::YES->name],
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
