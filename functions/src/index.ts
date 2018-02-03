import * as functions from 'firebase-functions';
import * as admin  from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const messaging = admin.messaging();

const logger = { info: console.log, error: console.error }

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
        res.status(500).send(`invalid request. 
        Check if the header for { content-type: application/json} parameter`)
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

export let notifyRole = functions.https.onRequest((req, res) => {
    const { role, ...message } = req.body;

    if (!role) {
        res.status(500).send(`invalid request. 
        Check if the header for { content-type: application/json} parameter`)
        return '';
    }

    return db.collection('roles')
        .doc(role)
        .collection('messages')
        .add(message)
        .then( () => {
             // ES6 Destructuring assignment
            const { payload, options } = getPlayloadAndOptions(message)

            // Send a message to devices subscribed to the provided topic.
            return admin.messaging().sendToTopic(role, payload, options)
                .then(function (response) {
                    // See the MessagingTopicResponse reference documentation for the
                    // contents of response.
                    logger.info("Successfully sent message:", response);
                })

        })
        .then(ref => {
            res.status(200).send('ok');
        })
        .catch(function (error) {
            res.status(500).send(error);
        });
});

/** 
 *  Firestore Listener
 */

// Listen for any change on document `marie` in collection `users`
export let onNewMessageSendFCM = functions.firestore
    .document('users/{userId}/messages/{messageId}')
    .onCreate((event) => {
        logger.info('new message was created!');

        const userId = event.params.userId;
        
        // ES6 Destructuring assignment
        const { payload, options } = getPlayloadAndOptions(event.data.data())

        if (!event.params.userId) {
            logger.error(event.params);
            return '';
        }

        return db.collection('users')
            .doc(userId)
            .collection('fcmTokens')
            .get()
            .then(snapshot => {
                const tokens = snapshot.docs
                    .map(doc => doc.data().token)
                    .filter(token => !!token)
                logger.info(tokens, '=>', payload);
                return sendMessage(tokens, payload, options);
            })
            .catch(err => {
                logger.error('Error getting fcmTokens and sending msg', err);
            });
    });

function getPlayloadAndOptions(content){
    const { data, title, body, clickAction, icon, ...options } = content;

    const payload = { notification: { title, body, clickAction, icon } };
    if (data) {
        payload['data'] = JSON.parse(data);
    }
    return { payload, options };
}

function sendMessage(registrationToken, payload, options) {
    console.log('sending mensage.. ', payload);
    return admin.messaging()
        .sendToDevice(registrationToken, payload, options)
        .then(function (response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            logger.info("Successfully sent message:", response);
            return;
        })
        .catch(function (error) {
            logger.error("Error sending message:", error);
        });
}




export let subscribeNewDeviceToUserRolesTopic = functions.firestore
    .document('users/{userId}/fcmTokens/{fcmTokenId}')
    .onCreate((event) => {
        // ES6 Destructuring assignment
        const { token } = event.data.data();
        const userId = event.params.userId;

        logger.info('subscribing token to roles topics', userId, token);
        
        return db.collection('users')
            .doc(userId)
            .get()
            .then( user => {
                const roles = user
                .get('roles')

                logger.info(`subscribing token to roles topics: ${roles}`);

                return subcribeToRolesTopics(token, roles);
            });
    })

function subcribeToRolesTopics(token, roles:Array<string>){
    const promises = roles.map(role => 
        messaging.subscribeToTopic(token, role))

    return Promise.all(promises);
}