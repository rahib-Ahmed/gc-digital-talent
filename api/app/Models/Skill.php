<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class Skill
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property array $description
 * @property array $keywords
 * @property string $category
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class Skill extends Model
{
    use HasFactory;
    use HasRelationships;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'keywords' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['details'];

    public function families(): BelongsToMany
    {
        return $this->belongsToMany(SkillFamily::class);
    }

    public function userSkills(): HasMany
    {
        return $this->hasMany(UserSkill::class);
    }

    public function poolsEssentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pools_essential_skills');
    }

    public function poolsNonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pools_nonessential_skills');
    }

    public function getDetailsAttribute()
    {
        return isset($this->experience_skill_pivot) ? $this->experience_skill_pivot->details : '';
    }

    public static function scopeTechnical(Builder $query)
    {
        return $query->where('category', '=', ApiEnums::SKILL_CATEGORY_TECHNICAL);
    }

    public static function scopeBehavioural(Builder $query)
    {
        return $query->where('category', '=', ApiEnums::SKILL_CATEGORY_BEHAVIOURAL);
    }
}
