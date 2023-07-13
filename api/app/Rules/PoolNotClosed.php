<?php

namespace App\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Pool;
use Database\Helpers\ApiEnums;

class PoolNotClosed implements ValidationRule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $pool = Pool::find($value);

        if (is_null($pool->closing_date) || $pool->closing_date->isFuture()) {
            $fail(ApiEnums::POOL_CANDIDATE_POOL_CLOSED);
        }
    }
}
