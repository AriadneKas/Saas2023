const router = require('express').Router();
const axios = require('axios')


//adapt to docker

const ports = [9001, 9002, 9003]
const host = process.env.HOST || 'localhost'

router.get('/flushall', (req, res) => {
    ports.forEach(port => {
        axios.get(`http://${host}:${port}/admin/flushall`).catch(err => {
            console.log(`Cannot comminicate with port ${port}.`)
        })
    })
    res.status(200).send('ALL FLUSHED')
    console.log('ALL FLUSHED ?');
})

module.exports = router;