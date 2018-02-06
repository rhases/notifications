import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl = 'home';
    authorization;

    constructor(
        private route: ActivatedRoute,
        private db: AngularFirestore,
        private router: Router,
        private afAuth: AngularFireAuth) {
        this.route
            .queryParams
            .subscribe(params => {
                this.returnUrl = params['returnUrl'] || 'home';
                this.authorization = params['authorization'] || '';
            });
        }

    ngOnInit() {
        return this.route.params.subscribe(params => {
            return this.afAuth.auth
            .signInWithCustomToken(params.token) // signin in the firebase
            .then(this.updateProfile(this.authorization))
            .then(() => this.router.navigateByUrl(this.returnUrl))
            .catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
                console.error(errorCode, errorMessage);
            });
        });
    }

    /**
     * Update user profile in firebase with info got from rhases-auth
     * @param authorization (jwt) to access rhases-auth
     * */
    updateProfile(authorization) {
        return () => {
            const url = `${environment.rhasesAuthServiceHost}/api/users/me`;
            return fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: new Headers(
                    { authorization: `Bearer ${authorization}`,
                    'Content-Type': 'text/plain' })
            })
            .then(this.getUser)
            .then((rhasesUser) => {
                const self = this;
                const { name, email, picture, phone } = rhasesUser;

                const user = firebase.auth().currentUser;
                return user.updateProfile({
                    displayName: name,
                    photoURL: picture
                })
                .catch(self.handleMinorError)
                .then(() => email && user.updateEmail(email))
                .catch(self.handleMinorError)
                .then(() => phone && user.updatePhoneNumber(phone))
                .catch(self.handleMinorError)
                .then(() => rhasesUser);
            })
            .then(rhasesUser => // set roles
                this.db
                    .collection('users')
                    .doc(rhasesUser._id)
                    .set({ roles: rhasesUser.roles })
            );
        };
    }

    getUser(respose) {
        if (!respose.status || respose.status > 200 ) {
            throw new Error('Error fetching rhases-auth user');
        }

        return respose.json();
    }

    handleMinorError(err) {
        console.warn(err);
    }
}
