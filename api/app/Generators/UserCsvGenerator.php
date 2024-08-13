<?php

namespace App\Generators;

use App\Enums\ArmedForcesStatus;
use App\Enums\CitizenshipStatus;
use App\Enums\EstimatedLanguageAbility;
use App\Enums\EvaluatedLanguageAbility;
use App\Enums\GovEmployeeType;
use App\Enums\IndigenousCommunity;
use App\Enums\Language;
use App\Enums\OperationalRequirement;
use App\Enums\WorkRegion;
use App\Models\User;
use App\Traits\Generator\GeneratesFile;
use Illuminate\Support\Arr;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class UserCsvGenerator extends CsvGenerator implements FileGeneratorInterface
{
    use GeneratesFile;

    protected array $generatedHeaders = [
        'general_questions' => [],
        'screening_questions' => [],
        'skill_details' => [],
    ];

    protected array $headerLocaleKeys = [
        'first_name',
        'last_name',
        'armed_forces_status',
        'citizenship',
        'interested_in_languages',
        'first_official_language',
        'second_language_exam_completed',
        'second_language_exam_validity',
        'comprehension_level',
        'writing_level',
        'oral_interaction_level',
        'estimated_language_ability',
        'government_employee',
        'department',
        'employee_type',
        'current_classification',
        'priority_entitlement',
        'priority_number',
        'location_preferences',
        'location_exemptions',
        'accept_temporary',
        'accepted_operational_requirements',
        'woman',
        'indigenous',
        'visible_minority',
        'disability',
        'skills',
    ];

    public function __construct(protected array $ids, public string $fileName, public ?string $dir, protected ?string $lang = 'en')
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->spreadsheet = new Spreadsheet();

        $sheet = $this->spreadsheet->getActiveSheet();
        $localizedHeaders = array_map(function ($key) {
            return $this->localizeHeading($key);
        }, $this->headerLocaleKeys);

        $sheet->fromArray($localizedHeaders, null, 'A1');
        $currentUser = 1;

        User::with([
            'department',
            'currentClassification',
            'userSkills' => ['skill'],
        ])
            ->whereIn('id', $this->ids)
            ->chunk(200, function ($users) use ($sheet, &$currentUser) {
                foreach ($users as $user) {

                    $department = $user->department()->first();
                    $preferences = $user->getOperationalRequirements();
                    $indigenousCommunities = Arr::where($user->indigenous_communities, function ($community) {
                        return $community !== IndigenousCommunity::LEGACY_IS_INDIGENOUS->name;
                    });
                    $userSkills = $user->userSkills->map(function ($userSkill) {
                        return $userSkill->skill->name[$this->lang] ?? '';
                    });

                    $values = [
                        $user->first_name, // First name
                        $user->last_name, // Last name
                        $this->localizeEnum($user->armed_forces_status, ArmedForcesStatus::class),
                        $this->localizeEnum($user->citizenship, CitizenshipStatus::class),
                        $this->lookingForLanguages($user),
                        $this->localizeEnum($user->first_official_language, Language::class),
                        is_null($user->second_language_exam_completed) ? '' : $this->yesOrNo($user->second_language_exam_completed), // Bilingual evaluation
                        $this->yesOrNo($user->second_language_exam_validity),
                        $this->localizeEnum($user->comprehension_level, EvaluatedLanguageAbility::class), // Reading level
                        $this->localizeEnum($user->written_level, EvaluatedLanguageAbility::class), // Writing level
                        $this->localizeEnum($user->verbal_level, EvaluatedLanguageAbility::class), // Oral interaction level
                        $this->localizeEnum($user->estimated_language_ability, EstimatedLanguageAbility::class),
                        $this->yesOrNo($user->is_gov_employee), // Government employee
                        $department->name[$this->lang] ?? '', // Department
                        $this->localizeEnum($user->gov_employee_type, GovEmployeeType::class),
                        $user->getClassification(), // Current classification
                        $this->yesOrNo($user->has_priority_entitlement), // Priority entitlement
                        $user->priority_number ?? '', // Priority number
                        $this->localizeEnumArray($user->location_preferences, WorkRegion::class),
                        $user->location_exemptions, // Location exemptions
                        $user->position_duration ? $this->yesOrNo($user->wouldAcceptTemporary()) : '', // Accept temporary
                        $this->localizeEnumArray($preferences['accepted'], OperationalRequirement::class),
                        $this->yesOrNo($user->is_woman), // Woman
                        $this->localizeEnumArray($indigenousCommunities, IndigenousCommunity::class),
                        $this->yesOrNo($user->is_visible_minority), // Visible minority
                        $this->yesOrNo($user->has_disability), // Disability
                        $userSkills->join(', '),
                    ];

                    // 1 is added to the key to account for the header row
                    $sheet->fromArray($values, null, 'A'.$currentUser + 1);
                    $currentUser++;
                }
            });

        return $this;
    }

    /**
     * Get looking for languages
     */
    private function lookingForLanguages(User $user): string
    {
        $languages = [];

        if ($user->looking_for_english) {
            $languages[] = $this->localize('language.en');
        }

        if ($user->looking_for_french) {
            $languages[] = $this->localize('language.fr');
        }

        if ($user->looking_for_bilingual) {
            $languages[] = $this->localize('common.bilingual');
        }

        return implode(', ', $languages);
    }
}
