<?php

namespace App\Enums;

use App\Traits\HasLocalization;

enum PublishingGroup
{
    use HasLocalization;

    case IAP;
    case IT_JOBS;
    case IT_JOBS_ONGOING;
    case EXECUTIVE_JOBS;
    case OTHER;

    public static function getLangFilename(): string
    {
        return 'publishing_group';
    }
}
