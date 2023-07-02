const router = require('express').Router();
const quotasModel = require('../models/userQuotas');

router.get('/flushall', async (req, res) => {
    try { 
        await quotasModel.deleteMany({});
        res.status(200).send("Flushed all");
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;