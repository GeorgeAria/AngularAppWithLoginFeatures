import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { UserManager, User } from 'oidc-client';
import { Constants } from '../constants';

// AuthService will manage the overall security context for the application.

@Injectable({providedIn: CoreModule})
export class AuthService {
	// UserManager manages all the low-level details of OpenID Connect flows for you.
	// User encapsulates the client-side information about a signed-in user A (i.e. ID and access tokens 
	// returned from the identity provider).

	private _userManager: UserManager;
	private _user: User;

	constructor() {
		// stsSettings can contain a variety of settings related to the identity provider you will be connecting to.
		// NOTE: The identity provider for this app is IdentityServer4.
        // The first setting passed, authority, is the authority URL, which is typically the root URL for the identity provider.
        // The second setting passed is the client_id, which is an identifier to match up the client app
        // against a client configuration at the STS.
        // The third setting passed is the redirect_uri, which is where the user will be redirected to after authenticating
        // with the STS.
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
            response: 'code',
            post_logout_redirect_uri: `${Constants.clientRoot}signin-callback`
		};
		this._userManager = new UserManager(stsSettings);
	}
}
