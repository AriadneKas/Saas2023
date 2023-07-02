const jwt = require('jsonwebtoken');

function authNewUser(req, res, next){
    try {
        const token = req.params.token || req.cookies['token'];
        console.log("This is the token:")
        const decoded = jwt.verify(token, 'tempuser'); // Replace with your secret key
        req.googleId = decoded.googleId;
        req.email = decoded.email;
        next();
    } catch (err) {
        console.error('JWT error');
        res.redirect('/auth_failed');

    }
}

function isAuthedNewUser(token){
    try {
        const decoded = jwt.verify(token, 'tempuser'); // Replace with your secret key
        return decoded.email;
    } catch (err) {
        return false;
    }
}

module.exports = { authNewUser, isAuthedNewUser }
