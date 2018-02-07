import * as functions from 'firebase-functions';
import * as admin  from 'firebase-admin';
import * as _  from 'lodash';

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
    
    const { payload, options } = tryGetPayloadAndOptions(message)
    //remove not accept chars
    const topic = topifyStr(role); 

    return db.collection('roles')
        .doc(role)
        .collection('messages')
        .add(message)
        .then( () => {
            // Send a message to devices subscribed to the provided topic.
            return admin.messaging().sendToTopic(topic, payload, options)
                .then(function (response) {
                    // See the MessagingTopicResponse reference documentation for the
                    // contents of response.
                    logger.info(`Successfully sent message to ${topic}:`, response);
                })
        })
        .then(ref => {
            res.status(200).send('ok');
        })
        .catch(function (error) {
            logger.error(error);
            logger.error(topic, payload, options);
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
        const { payload, options } = tryGetPayloadAndOptions(event.data.data())

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

function getPayloadAndOptions(content){
    logger.info(content);
    // ES6 Destructuring assignment
    const { data, title, body, clickAction, icon, ...options_ } = content;
    // remove undefied fields
    const notification = _.pickBy({ title, body, clickAction, icon }, _.identity); 

    const payload = { notification };
    if (data && _.isObject(data)) {
        payload['data'] = data;
    }

    // remove undefied fields
    const options = _.pickBy(options_, _.identity);
    return { payload, options };
}

function tryGetPayloadAndOptions(content){
    try {
        return getPayloadAndOptions(content);
    }catch(err){
        logger.error('invalid message');
        logger.error(content);
        logger.error(err);
        return undefined;
    }
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
                    .map(topifyStr);

                logger.info(`subscribing token to roles topics: ${roles}`);

                return subcribeToRolesTopics(token, roles);
            });
    })

function subcribeToRolesTopics(token, roles:Array<string>){
    const promises = roles.map(role => 
        messaging.subscribeToTopic(token, role))

    return Promise.all(promises);
}

// replace not accepted as topics identificators
function topifyStr(str){
    return str.replace(RegExp('[^a-zA-Z0-9-_.~%]'), '~')
}