<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;

/**
 * Class AwardExperience
 *
 * @property int $id
 * @property int $user
 * @property string $title
 * @property string $issued_by
 * @property Illuminate\Support\Carbon $awarded_date
 * @property string $recipient_type
 * @property string $recognition_type
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class AwardExperience extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'awarded_date' => 'date',
    ];

    public function user(): MorphTo
    {
        return $this->morphTo(User::class, 'experience');
    }

    /*public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function user()
    {
        return $this->morphMany(User::class, 'experience');
    }*/
}
