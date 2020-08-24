export class Constants {
    // stsAuthority is the URL to the IdentityServer4 instance.
    // clientID is an identifier to match up the client app against a client configuration at the STS.
    // The second "clientID" comes from an Auth0 application.

   public static clientRoot = 'http://localhost:4200/';

    // public static apiRoot = 'https://securingangularappscoursev2-api-unsecure.azurewebsites.net/api/';
    // public static stsAuthority = 'https://securingangularappscoursev2-sts.azurewebsites.net/';

    public static apiRoot = 'http://localhost:2112/api/';
    public static stsAuthority = 'http://localhost:4242/';
    // public static stsAuthority = 'https://georgearias.us.auth0.com/'

    public static clientId = 'spa-client';
    // public static clientId = 'zzDeDXoHfIEzVlNiWrs0Yd4J1OZxe2jb';
}
