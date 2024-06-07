<?php

namespace App\Enums;

enum PriorityWeight
{
    case PRIORITY_ENTITLEMENT;
    case VETERAN;
    case CITIZEN_OR_PERMANENT_RESIDENT;
    case OTHER;

    public static function weight(string $weight): int
    {
        return match ($weight) {
            self::PRIORITY_ENTITLEMENT->name => 10,
            self::VETERAN->name => 20,
            self::CITIZEN_OR_PERMANENT_RESIDENT->name => 30,
            self::OTHER->name => 40
        };
    }
}
