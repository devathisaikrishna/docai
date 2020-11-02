<?php

namespace App\Providers;
use League\OAuth2\Server\Entities\ClientEntityInterface;

#ref https://github.com/laravel/passport/issues/342

class ScopeRepository extends \Laravel\Passport\Bridge\ScopeRepository
{
    public function finalizeScopes(array $scopes, $grantType, ClientEntityInterface $clientEntity, $userIdentifier = null)
    {
        if ('authorization_code' === $grantType) {
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
}