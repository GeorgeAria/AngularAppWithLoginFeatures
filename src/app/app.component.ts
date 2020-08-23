import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  // _authService helps to login a user on launch if there's already one in session storage from a previous login.
  // The code in the constructor changed the "isLoggedIn" value when logged in status changes.
  constructor(private _authService: AuthService) {
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
    this._authService.isLoggedIn()
    .then(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  // The login() method is triggered when the login button is pressed.
  login() {
    this._authService.login();
  }

  logout() {
    this._authService.logout();
  }
}
