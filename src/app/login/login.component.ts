import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl = 'home';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private afAuth: AngularFireAuth) {
        this.route
            .queryParams
            .subscribe(params => {
                this.returnUrl = params['returnUrl'] || 'home';
            });
        }

    ngOnInit() {
        return this.route.params.subscribe(params => {
            return this.afAuth.auth
            .signInWithCustomToken(params.token)
            .then( () => {
                this.router.navigateByUrl(this.returnUrl);
            })
            .catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
                console.error(errorCode, errorMessage);
            });
        });
    }

}
