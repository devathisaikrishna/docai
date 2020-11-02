<?php

namespace App\Providers;

use Laravel\Passport\Passport;
use Laravel\Passport\Bridge\Scope;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\ScopeEntityInterface;

#ref https://github.com/laravel/passport/issues/342
#ref https://github.com/laravel/passport/issues/195

class UserScoeCustomize extends \Laravel\Passport\Bridge\ScopeRepository
{
    public function finalizeScopes(array $scopes, $grantType, ClientEntityInterface $clientEntity, $userIdentifier = null)
    {
        if ('client_credentials' === $grantType) {
            $scopes = $this->processClientCredentialScopes($scopes, $clientEntity);
        }
        return parent::finalizeScopes($scopes, $grantType, $clientEntity, $userIdentifier);
    }

    /**
     * @param \Laravel\Passport\Bridge\Scope[] $scopes
     * @param ClientEntityInterface $clientEntity
     * @return \Laravel\Passport\Bridge\Scope[]
     */
    protected function processClientCredentialScopes($scopes, ClientEntityInterface $clientEntity)
    {
        if (0 === count($scopes) || (1 === count($scopes) && '*' === $scopes[0]->getIdentifier())) {
            $scopes = Passport::scopes()->map(function (Scope $scope) {
                return new \Laravel\Passport\Bridge\Scope($scope->id);
            })->all();
        }

        $client = app(ClientRepository::class)->find($clientEntity->getIdentifier());
        $clientScopes = explode(' ', $client->scopes);

        return collect($scopes)->filter(function (ScopeEntityInterface $scope) use ($clientScopes) {
            return in_array($scope->getIdentifier(), $clientScopes, true);
        })->all();
    }

    public function getScopeEntityByIdentifier($identifier)
    {
        $scope = ["ai.document.service"];

        if (Passport::hasScope($identifier) && in_array($identifier, $scope)) {
            return new Scope($identifier);
        }
    }
}
