<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\UnencryptedToken;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //add the creation of a nonce alongside state
        $state = Str::random(40);
        $nonce = Str::random(40);
        $request->session()->put('state', $state);
        $request->session()->put('nonce', $nonce);

        $request->session()->put(
            'from',
            $request->input('from')
        );

        $requestedLocale = $request->input('locale');
        if(strcasecmp($requestedLocale, 'en') == 0)
            $ui_locales = 'en-CA en';
        else if(strcasecmp($requestedLocale, 'fr') == 0)
            $ui_locales = 'fr-CA fr';
        else
            $ui_locales = $requestedLocale;

        $scope = 'openid';
        // Laravel auth server will error out if you request offline_access scope
        if(config('oauth.authorize_uri') != 'http://localhost:8000/oauth/authorize')
            $scope = $scope . ' offline_access';

        //add nonce in this query
        $query = http_build_query([
            'client_id' => config('oauth.client_id'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'response_type' => 'code',
            'scope' => $scope,
            'state' => $state,
            'nonce' => $nonce,
            'acr_values' => 'mfa',
            'ui_locales' => $ui_locales,
        ]);

        return redirect(config('oauth.authorize_uri') . '?' . $query);
    }

    public function authCallback(Request $request)
    {
        //pull the original nonce alongside state
        $state = $request->session()->pull('state');
        $nonce = $request->session()->pull('nonce');
        var_dump($nonce);

        throw_unless(
            strlen($state) > 0 && $state === $request->state,
            new InvalidArgumentException("Invalid session state")
        );

        $response = Http::asForm()->post(config('oauth.token_uri'), [
            'grant_type' => 'authorization_code',
            'client_id' => config('oauth.client_id'),
            'client_secret' => config('oauth.client_secret'),
            'redirect_uri' => config('oauth.redirect_uri'),
            'code' => $request->code,
        ]);

        // decode id_token stage
        // pull token out of the response

        $idToken = $response->json("id_token");

        // following the online Lcobucci documentation, attempt to parse the token
        // no key verification is being done here, ideally things are done more thoroughly here, something to think about
        $config = Configuration::forUnsecuredSigner(
            //
        );
        assert($config instanceof Configuration);
        $token = $config->parser()->parse($idToken);
        assert($token instanceof UnencryptedToken);

        //now, grab the tokenNonce out of the unencrypted thing, use claims()->get() to grab the nonce
        //and compare to the nonce grabbed at line 59 and throw_unless

        $claimed = $token->claims()->get('nonce');
        var_dump($claimed);
        //var_dump($nonce);

        $tokenNonce = $claimed;
        throw_unless(
            strlen($tokenNonce) > 0 && $tokenNonce === $nonce,
            new InvalidArgumentException("Invalid session nonce")
        );

        $query = http_build_query($response->json());

        $from = $request->session()->pull('from');

        if($from != filter_var($from, FILTER_SANITIZE_URL))
            $from = null; // Contains unsanitary characters. Throw it away.
        if(substr($from, 0, 1) != '/')
            $from = null; // Does not start with / so it's not a relative url. Don't want an open redirect vulnerability. Throw it away.

        $navigateToUri = strlen($from) > 0 ? config('app.url').$from : config('app.url').config('app.app_dir');
        return redirect($navigateToUri . '?' . $query);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->query('refresh_token');
        $response = Http::asForm()
            ->post(config('oauth.token_uri'), [
                    'grant_type' => 'refresh_token',
                    'client_id' => config('oauth.client_id'),
                    'client_secret' => config('oauth.client_secret'),
                    'refresh_token' => $refreshToken,
                ]);
        return response($response);
    }
}
