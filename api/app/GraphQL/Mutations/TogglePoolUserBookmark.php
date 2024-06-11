<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use Illuminate\Support\Facades\Auth;

final class TogglePoolUserBookmark
{
    /**
     * Toggles a user's bookmarked pool
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        $pool = Pool::find($args['pool_id']);
        $user->poolBookmarks()->toggle($pool->id);

        return $pool;
    }
}
