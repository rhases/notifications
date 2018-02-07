import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
// import { DialogComponent } from './dialog/dialog.component';
import 'rxjs/add/operator/filter';


import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { PushNotificationService } from '../../components/push-notification/push-notification.service';
// import { snapshotToArray } from '../../../components/util';

import { Howl } from 'howler';

import * as _ from 'lodash';



@Component({
  templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {
  userUid;
  messages: Observable<any[]>;
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
    this.afAuth.auth.onAuthStateChanged(user => {
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
  }

  loadMessages(userUid) {
    const self = this;
    const userRef = this.db.collection('users')
      .doc(userUid);

    // private messages
    let privateMessages = userRef
      .collection('messages')
      .valueChanges()

    // messages to user roles
    userRef
      .valueChanges()
      .forEach(user => {
        let observables = [privateMessages].concat(user['roles'].map(role => this.loadTopic(role)));

        self.messages = combineLatest(observables,
          (...messageArrays) => _.orderBy(_.flatten(messageArrays), 'createdAt', 'desc'))

        self.messages
          .subscribe(messages => { this.playSoundAlert(); });
      });



  }

  loadTopic(role) {
    // console.log(`Loading to ${role}...`)
    const self = this;

    let obs = this.db.collection('roles')
      .doc(role)
      .collection('messages')
      .valueChanges()

    // obs.subscribe(z => console.log(z))

    return obs;
  }

  playSoundAlert() {
    // Shoot the laser!
    this.sound.play();
  }

}
