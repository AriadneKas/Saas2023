const router = require('express').Router();
const users = require('../models/users');
const tempUsers = require('../models/tempUsers');

router.get('/flushall', async (req, res) => {
    await tempUsers.deleteMany({});
    users.deleteMany({}).then(() =>
        res.send('users flushed')
    ).catch(err => {
        res.status(500).send('error flushing users');
    })
})

module.exports = router;