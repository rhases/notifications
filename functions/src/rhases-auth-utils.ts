// import * as jwt from 'jsonwebtoken';
// import * as functions from 'firebase-functions';

// /**
//  * Returns a jwt token signed by the app secret
//  */
// function signToken(id, roles) {
//     const session_secret = functions.config().auth_server.session_secret;

//     return jwt.sign({
//         _id: id,
//         roles: roles
//     }, session_secret, {
//         expiresIn: 1000 * 60 * 60 // 1 hour
//     });
// }

// function getAdminToken(){
//     return signToken('000000000000000000000000', ['user','admin'])
// }

// export function getUserRoles(userId) {
//     fetch();

// }