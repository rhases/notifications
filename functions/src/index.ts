import * as functions from 'firebase-functions';
import * as admin  from 'firebase-admin';


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


/**
 *  REST Endpoints
 */

/**
 *  POST /notify
 *  Content-Type: application/json
 *  body { 
 *      userId, 
 *      message
 *   } 
 */
export let notify = functions.https.onRequest((req, res) => {
    const { userId, ...message } = req.body;

    if (!userId){
        res.status(500).send('invalid request')
        return '';
    }
    
    return db.collection('users')
    .doc(userId)
    .collection('messages')
    .add(message)
    .then(ref => {
        res.status(200).send('ok');
    });

});


/** 
 *  Firestore Listener
 */

// Listen for any change on document `marie` in collection `users`
export let onNewMessageSendFCM = functions.firestore
    .document('users/{userId}/messages/{messageId}')
    .onCreate((event) => {
        console.log('new message was created!');

        const userId = event.params.userId;
        const { data, title, body, ...options }  = event.data.data();
        const payload = { notification: { title, body } };
        if (data && typeof data === 'object'){
            payload['data'] = data;
        }
        if (!event.params.userId) {
            console.error(event.params);
            return '';
        }

        return db.collection('users')
            .doc(userId)
            .collection('fcmTokens')
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if (!doc.data().token) return '';
                    
                    const token = doc.data().token;
                    console.log(doc.id, '=>', token);
                    return sendMessage(token, payload, options);
                });
            })
            .catch(err => {
                console.error('Error getting fcmTokens and sending msg', err);
            });
    });

function sendMessage(registrationToken, payload, options) {
    console.log('sending mensage.. ', payload);
    return admin.messaging()
        .sendToDevice(registrationToken, payload, options)
        .then(function (response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
            return;
        })
        .catch(function (error) {
            console.error("Error sending message:", error);
        });
}
