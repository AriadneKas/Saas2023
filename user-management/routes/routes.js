const users = require('../models/users');
const tempUsers = require('../models/tempUsers');
const { verify, addUser, replaceTempUser, addTempUser, deleteTempUser } = require('../util/utils')
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const secretKey = 'mykey' //change with environment variable
const secretKeyTempUser = 'tempuser' //change with environment variable



router.post('/login/google', async (req, res) => {
    try {
        const payload = await verify(req.body.credential);
        const user = await users.findOne({ googleId: payload.sub });
        let token;
        let isNewUser;
        if (user) {
            isNewUser = false;
            token = jwt.sign({ googleId: payload.sub }, secretKey , { expiresIn: 6000 })
        } else{
            await addTempUser(payload);
            isNewUser = true;
            token = jwt.sign({ googleId: payload.sub, email: payload.email }, secretKeyTempUser, { expiresIn: 6000 })
        }
        res.send({ token: token , isNewUser: isNewUser});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error in login process");
    }
});

router.get('/exchangetoken/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try {
        await replaceTempUser(googleId);
        token = jwt.sign({ googleId: googleId }, secretKey, { expiresIn: 6000 }); 
        res.send({ token: token, isNewUser: false });
    } catch (err) {
        res.status(500).send("Error in temporary user exchange");
    }
})

router.delete('/undoUser/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try {
        await deleteTempUser(googleId);
        res.status(200).send("User deleted");
    } catch (err) {
        res.status(500).send("Error in temporary user deletion");
    }
})

router.delete('/deleteUser/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, 'mykey'); //change with environment variable
        await users.deleteOne({ googleId: decoded.googleId });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in user deletion");
    }
})


router.get('/getUser/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const decoded = jwt.verify(token, 'mykey'); //change with environment variable
        const user = await users.findOne({ googleId: decoded.googleId });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.log('Cannot get user error:', err);
        res.status(500).json({ message: err.message });
    }
})

router.get('/healthcheck', (req, res) => {
    res.send({
        Status: 200,
        Message: "User management service is up and running"
    })
})


module.exports = router;