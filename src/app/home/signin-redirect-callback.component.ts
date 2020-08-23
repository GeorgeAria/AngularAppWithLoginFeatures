import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin-callback',
    template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
    constructor(private _authService: AuthService,
                private _router: Router) { }

// When the authService has fully logged the user in, it will send the user to the root URL of the app.
// replaceURL ensures that this component page will be removed from the back navigation stack.
    ngOnInit() {
        this._authService.completeLogin()
            .then(userThatWillNotBeUsed => {
                this._router.navigate(['/'], {replaceUrl: true});
            })
     }
}