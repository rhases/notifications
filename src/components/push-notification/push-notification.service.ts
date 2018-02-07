import { Injectable, EventEmitter, Output } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class PushNotificationService {
  user;
  tokens;

  constructor(public db: AngularFirestore) {}

  // Requests permissions to show notifications.
  requestNotificationsPermissions(userUid) {
    console.log('Requesting notifications permission...');
    const self = this;
    return firebase.messaging().requestPermission()
      // Notification permission granted.
      .then(() => self.saveMessagingDeviceToken(userUid));
  }

  // Saves the messaging device token to the datastore.
  saveMessagingDeviceToken(userUid) {
    const self = this;
    return firebase.messaging().getToken()
      .then((currentToken) => {
        if (currentToken) {
          console.log('Got FCM device token:', currentToken);
          // Save the Device Token to the datastore.
          return self.db
            .collection('users')
            .doc(userUid)
            .collection('fcmTokens')
            .doc(currentToken)
            .set({ added: new Date(), token: currentToken});

        } else {
          // Need to request permissions to show notifications.
          // return this.requestNotificationsPermissions();
        }
      });
  }
}
