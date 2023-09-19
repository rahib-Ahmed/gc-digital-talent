<?php

namespace App\Enums;

enum PoolCandidateSearchStatus
{
    case NEW;
    case IN_PROGRESS;
    case WAITING;
    case DONE;
}
