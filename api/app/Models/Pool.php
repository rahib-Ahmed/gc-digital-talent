<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

/**
 * Class Pool
 *
 * @property string $id
 * @property array $name
 * @property int $user_id
 * @property array $operational_requirements
 * @property array $key_tasks
 * @property array $your_impact
 * @property array $what_to_expect
 * @property array $advertisement_location
 * @property string $security_clearance
 * @property string $advertisement_language
 * @property string $stream
 * @property string $process_number
 * @property string $publishing_group
 * @property string $team_id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $closing_date
 * @property Illuminate\Support\Carbon $published_at
 * @property Illuminate\Support\Carbon $archived_at
 */
class Pool extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'operational_requirements' => 'array',
        'key_tasks' => 'array',
        'advertisement_location' => 'array',
        'your_impact' => 'array',
        'what_to_expect' => 'array',
        'closing_date' => 'datetime',
        'published_at' => 'datetime',
        'is_remote' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'is_remote',
        'closing_date',
        'published_at',
        'name',
        'key_tasks',
        'stream',
        'security_clearance',
        'advertisement_language',
        'your_impact',
        'what_to_expect',
        'advertisement_location',
        'publishing_group',
        'process_number',
        'operational_requirements',
        'archived_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }

    public function poolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class);
    }

    public function publishedPoolCandidates(): HasMany
    {
        return $this->hasMany(PoolCandidate::class)->notDraft();
    }

    public function essentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pools_essential_skills');
    }

    public function nonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'pools_nonessential_skills');
    }

    public function screeningQuestions(): HasMany
    {
        return $this->hasMany(ScreeningQuestion::class);
    }

    /* accessor to obtain Status, depends on two variables regarding published and expiry */
    public function getStatusAttribute()
    {
        // override if no publish date
        if (is_null($this->published_at)) {
            return ApiEnums::POOL_IS_DRAFT;
        }

        if (Carbon::now()->gte($this->archived_at)) {
            return ApiEnums::POOL_IS_ARCHIVED;
        }
        if (Carbon::now()->gte($this->closing_date)) {
            return ApiEnums::POOL_IS_CLOSED;
        }
        if (Carbon::now()->gte($this->published_at)) {
            return ApiEnums::POOL_IS_PUBLISHED;
        }

        return ApiEnums::POOL_IS_DRAFT;
    }

    public function scopeWasPublished(Builder $query, ?array $args)
    {
        $query->where('published_at', '<=', Carbon::now()->toDateTimeString());

        return $query;
    }

    public function scopeAuthorizedToView(Builder $query)
    {
        $user = Auth::user();

        if (! $user) {
            return $query->where('published_at', '<=', Carbon::now()->toDateTimeString());
        }

        if (! $user->isAbleTo('view-any-pool')) {
            $query->where(function (Builder $query) use ($user) {

                if ($user->isAbleTo('view-team-pool')) {
                    // Only add teams the user can view pools in to the query for `whereHAs`
                    $teams = $user->rolesTeams()->get();
                    $teamIds = [];
                    foreach ($teams as $team) {
                        if ($user->isAbleTo('view-team-pool', $team)) {
                            $teamIds[] = $team->id;
                        }
                    }

                    $query->orWhereHas('team', function (Builder $query) use ($teamIds) {
                        return $query->whereIn('id', $teamIds);
                    });
                }

                if ($user->isAbleTo('view-any-publishedPool')) {
                    $query->orWhere('published_at', '<=', Carbon::now()->toDateTimeString());
                }

                return $query;
            });
        }

        return $query;
    }

    public function scopeNotArchived(Builder $query)
    {
        $query->where(function ($query) {
            $query->whereNull('archived_at');
            $query->orWhere('archived_at', '>', Carbon::now()->toDateTimeString());
        });

        return $query;
    }
}
