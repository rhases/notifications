import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
 // import { DialogComponent } from './dialog/dialog.component';
import 'rxjs/add/operator/filter';


import { Observable } from 'rxjs/Observable';
import { PushNotificationService } from '../../components/push-notification/push-notification.service';
// import { snapshotToArray } from '../../../components/util';

@Component({
  templateUrl: './devices.component.html'
})
export class DevicesComponent implements OnInit {
  userUid;
  tokens;

  constructor(
    private pushNotificationService: PushNotificationService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged( user => {
      if (user) {
        // User is signed in.
        console.log(user);
        this.userUid = user.uid;
        this.loadDevices(this.userUid);
      } else {
        console.log('user not authenticated');
      }
    });
  }

  authorize() {
    this.pushNotificationService
    .requestNotificationsPermissions(this.userUid)
    .catch(err => {
      console.log(err);
    });
  }

  loadDevices(userUid) {
    const self = this;
    self.tokens = this.db.collection('users')
      .doc(userUid)
      .collection('fcmTokens')
      .valueChanges();
  }


}
