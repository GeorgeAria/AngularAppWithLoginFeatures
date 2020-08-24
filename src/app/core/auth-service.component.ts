import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { UserManager, User } from 'oidc-client';
import { Constants } from '../constants';
import { Subject } from 'rxjs';

// AuthService will manage the overall security context for the application.

@Injectable()
export class AuthService {
    // UserManager manages all the low-level details of OpenID Connect flows for you.
	// User encapsulates the client-side information about a signed-in user A (i.e. ID and access tokens 
	// returned from the identity provider).

    private _userManager: UserManager;
    private _user: User;
    private _loginChangedSubject = new Subject<boolean>();

    loginChanged = this._loginChangedSubject.asObservable();

    constructor() {
        // stsSettings can contain a variety of settings related to the identity provider you will be connecting to.
        // NOTE: The identity provider for this app is IdentityServer4.
        // The first setting passed, authority, is the authority URL, which is typically the root URL for the identity provider.
        // The second setting passed is the client_id, which is an identifier to match up the client app
        // against a client configuration at the STS.
        // The third setting passed is the redirect_uri, which is where the user will be redirected to after authenticating
        // with the STS. (NOTE: signin-callback can be found in the "app-routing-module.ts" file).
        // The fourth setting passed, scope, identifies the scopes (high level access control identifiers for your backend
        // resource, like an API) that your app requires access to.
        // NOTE: You'll always need the 'openid' scope when using OpenID Connect. The 'profile' scope is optional.
        // The 'projects-api' scope is associated with the back end api for this app.
        // The fifth setting passed is response, which is the response type that you need. For Authorization Code Flow with
        // PKCE, the setting is set to 'code'.
        // The sixth setting, post_logout_redirect_uri, is where the STS can redirect the user to after we redirect to the STS to logout.


        const stsSettings = {
            authority: Constants.stsAuthority,
            client_id: Constants.clientId,
            redirect_uri: `${Constants.clientRoot}signin-callback`,
            scope: 'openid profile projects-api',
            response_type: 'code',
            post_logout_redirect_uri: `${Constants.clientRoot}signout-callback`,
            // metadata needs to be used to correctly communication with Auth0.
            // If Auth0 is not used as the STS, it is not needed.
            /*metadata: {
                issuer: `${Constants.stsAuthority}`,
                // The "audience=projects-api" will allow the access token that gets returned to the user to be a JWT token.
                // projects-api is the custom api created in Auth0.
                authorization_endpoint: `${Constants.stsAuthority}authorize?audience=projects-api`,
                jwks_uri: `${Constants.stsAuthority}.well-known/jwks.json`,
                token_endpoint: `${Constants.stsAuthority}oauth/token`,
                userinfo_endpoint: `${Constants.stsAuthority}userinfo`,
                // tslint:disable-next-line: max-line-length
                end_session_endpoint: `${Constants.stsAuthority}v2/logout?client_id=${Constants.clientId}&returnTo=${encodeURI(Constants.clientRoot)}signout-callback`
              }*/
        };
        this._userManager = new UserManager(stsSettings);
    }

    // The method will redirect the user to the STS login screen (signinRedirect() returns a Promise).
    login() {
        return this._userManager.signinRedirect();
    }

    logout() {
        this._userManager.signoutRedirect();
    }

    // This method checks to see if a user is logged in.
    isLoggedIn(): Promise<boolean> {
        // getUser() returns a promise that produces a user object.
        // The user object is then checked to see it is not null or not expired.
        // A boolean is then returned determining if there is a user signed in or not.
        return this._userManager.getUser()
        .then(user => {
            const userCurrent = !!user && !user.expired;
            if(this._user !== user) {
                this._loginChangedSubject.next(userCurrent);
            }
            this._user = user;
            return userCurrent;
        });
    }

    // This method is needed to complete the sign-in process.
    completeLogin() {
        return this._userManager.signinRedirectCallback()
            .then(user => {
                this._user = user;
                this._loginChangedSubject.next(!!user && !user.expired);
                return user;
            })
    }

    completeLogout() {
        this._user = null;
        return this._userManager.signoutRedirectCallback();
    }

    // This method returns the access token of a currently logged in user.
    // This will be used to make API calls. Otherwise, the API can not be used.
    getAccessToken() {
        return this._userManager.getUser()
            .then(user => {
                if (!!user && !user.expired) {
                    return user.access_token;
                }
                else {
                    return null;
                }
            })
    }
}
