<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Skill library
    |--------------------------------------------------------------------------
    |
    | A feature to allow users to build a library of skills associated with
    | themselves with competency levels.
    |
    */

    'skill_library' => (bool) env('FEATURE_SKILL_LIBRARY', false),

    /*
    |--------------------------------------------------------------------------
    | Status notifications
    |--------------------------------------------------------------------------
    |
    | A feature to provide users with notifications queued whenever one of
    | their pool candidates changes status.
    |
    */

    'status_notifications' => (bool) env('FEATURE_STATUS_NOTIFICATIONS', false),

    /*
    |--------------------------------------------------------------------------
    | Record of decision
    |--------------------------------------------------------------------------
    |
    | A feature to introduce a multiple step assessment builder for evaluating candidates
    |
    */

    'record_of_decision' => (bool) env('FEATURE_RECORD_OF_DECISION', false),
];
