const jwt = require('jsonwebtoken');

function auth(req, res, next){
    try {
        const token = req.params.token || req.cookies['token'];
        const decoded = jwt.verify(token, 'mykey'); // Replace with your secret key
        req.googleId = decoded.googleId;
        next();
    } catch (err) {
        res.redirect('/auth_failed');
    }
}

function isAuthed(token){
    try {
        const decoded = jwt.verify(token,'mykey'); // Replace with your secret key
        return decoded.googleId;
    } catch (err) {
        return false;
    }
}

module.exports = { auth , isAuthed };
