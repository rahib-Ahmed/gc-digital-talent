<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Database\Helpers\KeyStringHelpers;

final class DuplicatePool
{
    /**
     * Duplicates a pool
     *
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id']);

        $newPool = $pool->replicate()->fill([
            'name' => [
                'en' => $pool->name['en'] . ' (copy)',
                'fr' => $pool->name['fr'] . ' (copie)',
            ],
            'key' => $pool->key ? $pool->key . '_' . time() : null, // If duplicating a pool with a non-null key, ensure the new key is unique.
            'closing_date' => null,
            'published_at' => null,
        ]);
        $newPool->save();

        $newPool->classifications()->sync($pool->classifications->pluck('id'));
        $newPool->essentialSkills()->sync($pool->essentialSkills->pluck('id'));
        $newPool->nonessentialSkills()->sync($pool->nonessentialSkills->pluck('id'));

        foreach ($pool->screeningQuestions as $screeningQuestion) {
            $newQuestion = $screeningQuestion->replicate();
            $newQuestion->save();
            $newPool->screeningQuestions()->save($newQuestion);
        }

        return $newPool;
    }
}
