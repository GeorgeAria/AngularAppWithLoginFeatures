import { UserProfile } from './user-profile';
import { SimpleClaim } from './simple-claim';

export class AuthContext {
  claims: SimpleClaim[];
  userProfile: UserProfile;
  // isAdmin helps to determine if the user is an admin, which will help either show or hide elements in the DOM.
  get isAdmin() {
    return !!this.claims && !!this.claims.find(c =>
      c.type === 'role' && c.value === 'Admin');
  }
}