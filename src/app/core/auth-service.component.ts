import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { UserManager, User } from 'oidc-client';

@Injectable({providedIn: CoreModule})
export class AuthService {
    // UserManager manages all the low-level details of OpenID Connect flows for you.
    // User encapsulates the client-side information about a signed-in user A (i.e. ID and access tokens 
    // returned from the identity provider).

    private _userManager: UserManager;
    private _user: User;

    constructor() 
    { 
        // stsSettings can contain a variety of settings related to the identity provider you will be connecting to.
        // NOTE: The identity provider for this app is IdentityServer4.

        const stsSettings = {};
        this._userManager = new UserManager(stsSettings);
    }

    
}