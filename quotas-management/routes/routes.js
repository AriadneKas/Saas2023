const router = require('express').Router();
const quotasModel = require('../models/userQuotas');

const defaultQuotas = 10;

router.get('/getQuotas/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try {
        const quotas = await quotasModel.findOne({ googleId: googleId });
        if (quotas) {
            res.status(200).json({ quotas: quotas });
        } else {
            res.status(404).json({ Status: 404, Message: "User not found" });
        }
    } catch (err) {

        res.status(500).json({ Status: 500, Message: "Internal Server Error" });
    }
})


router.post('/newUser', async (req, res) => {
    try {
        const googleId = req.body.googleId;
        const quotas = req.body.quotas || defaultQuotas;
        await quotasModel.create({ googleId: googleId, quotas: quotas })
        res.json({ Status: 200, Message: `User ${googleId} added successfully with quotas ${quotas}` })
    } catch (err) {
        if (err.code === 11000) {
            console.log('Duplicate entry in DB', err.message);
            res.status(400).json({ Status: 400, Message: `User ${googleId} already exists in DB` });
        } else {
            console.log('Error in adding new user', err.message);
            res.status(500).json({ Status: 500, Message: err.message });
        }
    }
});


router.put('/add/:googleId/:units', async (req, res) => {

    const googleId = req.params.googleId;
    const units = Number(req.params.units) || 1;
    try {
        const quotas = await quotasModel.findOne({ googleId: googleId });
        const newQuotas = quotas.quotas + units;
        await quotasModel.updateOne({ googleId: googleId }, { $set: { quotas: newQuotas } });
        res.status(200).send({
            googleId: quotas.googleId,
            quotas: newQuotas
        })
    } catch (err) {
        console.log('Error in adding quotas to user', err.message);
        res.status(500).json({ Status: 500, Message: err.message });
    }
})

router.put('/use/:googleId/:units', async (req, res) => {
    const googleId = req.params.googleId;
    const units = Number(req.params.units) || 1;
    try {
        const quotasLeft = await quotasModel.findOne({ googleId: googleId }); //put try catch
        if (quotasLeft.quotas >= units) {
            const left = Number(quotasLeft.quotas) - units;
            await quotasModel.updateOne({ googleId: googleId }, { $set: { quotas: left } });
            res.json({ Status: 200, output: true, Message: `Used ${units} quota of user ${googleId}, ${left} more left.` });
        } else {
            res.json({ Status: 400, output: false, Message: `You want to consume ${units} quota of user ${googleId}, howerver ${quotasLeft.quotas} are left.` })
        }

    } catch (err) {
        console.log('Error in comsuming quotas', err.message);
        res.status(500).json({ Status: 500, Message: err.message });
    }


})

router.get('/healthcheck', (req, res) => {
    res.json({
        Status: 200,
        Message: "Service quotas-management up and running"
    });
})

module.exports = router;