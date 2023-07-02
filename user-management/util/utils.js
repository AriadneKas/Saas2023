const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '1088226481644-j4153fvd7dvok187pqa19ss0nkecvkbi.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const users = require('../models/users');
const tempUsers = require('../models/tempUsers');
const axios = require('axios');

const host = process.env.HOST || 'localhost';

const quotaURI = `http://${host}:9002/quotas-api`
const defaultUserQuotas = 5

async function verify(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        return payload
    } catch (err) {
        throw new Error("Error verifying token");
    }
}

async function newUserQuotas(googleId) {
    try {
        await axios.post(quotaURI + '/newUser', { googleId: googleId, quotas: defaultUserQuotas });
    } catch (err) {
        console.error(err);
        throw new Error("Could not add user quotas");
    }
}

async function addUser(newUser) {
    try {
        const userToSave = new users({
            googleId: newUser.googleId,
            displayName: newUser.displayName,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            image: newUser.image,
            email: newUser.email,
        });
            await userToSave.save();
            await newUserQuotas(newUser.googleId)
            console.log('New user');
            return userToSave;
    } catch (err) {
        throw err;
    }
}

async function addTempUser(tempUser) {
    try {
        const userToSave = new tempUsers({
            googleId: tempUser.sub,
            displayName: tempUser.name,
            firstName: tempUser.given_name,
            lastName: tempUser.family_name,
            image: tempUser.picture,
            email: tempUser.email,
        });
            await userToSave.save();
            console.log(userToSave);
            return userToSave;
    } catch (err) {
        throw err;
    }
}

async function replaceTempUser(googleId) {
    try {
        const toTranfer = await tempUsers.findOneAndRemove({ googleId: googleId });
        await addUser(toTranfer);
    } catch (err) {
        throw err;
    }
}

async function deleteTempUser(googleId) {
    try {
        await tempUsers.findOneAndRemove({ googleId: googleId });
    } catch (err) {
        throw err;
    }
}

module.exports = {
    verify,
    addUser,
    addTempUser,
    replaceTempUser,
    deleteTempUser
}