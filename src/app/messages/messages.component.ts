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

import { Howl } from 'howler';



@Component({
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {
  userUid;
  messages = [];
  sound: Howl;

  constructor(
    private pushNotificationService: PushNotificationService,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth) {

    this.sound = new Howl({
      src: ['assets/definite.mp3']
    });
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged( user => {
      if (user) {
        // User is signed in.
        console.log(user);
        this.userUid = user.uid;
        this.loadMessages(this.userUid);
      } else {
        // TODO redirect to login?
        console.log('user not authenticated');
      }
    });
    this.playSoundAlert();
  }

  loadMessages(userUid) {
    const self = this;
    const userRef = this.db.collection('users')
      .doc(userUid);

    // private messages
    userRef
      .collection('messages')
      .valueChanges()
      .subscribe(message => { self.messages.push(message); });

    // messages to user roles
    userRef
      .valueChanges()
      .forEach(user => {
        user['roles'].forEach(role => this.loadTopic(role) );
       });

  }

  loadTopic(role) {
    const self = this;
    this.db.collection('roles')
      .doc(role)
      .collection('messages')
      .valueChanges()
      .subscribe(messages =>
        messages.forEach(
          message => self.messages.push(message)));
  }

  playSoundAlert() {
    // Shoot the laser!
    this.sound.play();
  }

}
