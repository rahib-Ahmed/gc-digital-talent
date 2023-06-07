<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use UnexpectedValueException;

/**
 * Class PoolCandidateSearchRequest
 *
 * @property int $id
 * @property string $full_name
 * @property string $email
 * @property int $department_id
 * @property string $job_title
 * @property string $additional_comments
 * @property string $pool_candidate_filter_id
 * @property boolean $was_empty
 * @property string $admin_notes
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 * @property Illuminate\Support\Carbon $done_at
 */

class PoolCandidateSearchRequest extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */

    protected $casts = [
        'done_at' => 'datetime',
    ];

    /**
     * Model relations
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function poolCandidateFilter(): BelongsTo
    {
        return $this->belongsTo(PoolCandidateFilter::class);
    }

    public function applicantFilter(): BelongsTo
    {
        return $this->belongsTo(ApplicantFilter::class);
    }

    /**
     * Scopes/filters
     */
    public static function scopeSearchRequestStatus(Builder $query, ?array $searchRequestStatuses)
    {
        // currently status is either done or pending, so selecting both is the same as doing nothing
        if (empty($searchRequestStatuses) || count($searchRequestStatuses) >= 2) {
            return $query;
        }

        // $searchRequestStatuses comes from enum PoolCandidateSearchStatus
        // status is based off field done_at, a getter found below
        if ($searchRequestStatuses[0] == ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_PENDING) {
            $query->whereDate('done_at', '>', Carbon::now())
                ->orWhereNull('done_at');
        }
        if ($searchRequestStatuses[0] == ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE) {
            $query->whereDate('done_at', '<=', Carbon::now());
        }
        return $query;
    }

    /**
     * Getters/Mutators
     */
    public function getStatusAttribute(): string
    {
        $thisDoneAt = $this->done_at;
        if (!is_null($thisDoneAt) && $thisDoneAt->isPast())
            return ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE;
        else
            return ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_PENDING;
    }

    public function setStatusAttribute($statusInput): void
    {
        if ($statusInput == ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_DONE)
            $this->done_at = CarbonImmutable::now();
        else if ($statusInput == ApiEnums::POOL_CANDIDATE_SEARCH_STATUS_PENDING)
            $this->done_at = null;
        else
            throw new UnexpectedValueException("status");
    }
}
