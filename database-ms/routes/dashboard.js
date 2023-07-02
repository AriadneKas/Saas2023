const router = require('express').Router();
const Chart = require('../models/chart.js')
const fs = require('fs');

const port = process.env.PORT || 9003;

const local_URI = "http://localhost:" + port;

router.get('/getCharts/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    try{
        const charts = await Chart.find({ googleId: googleId },{createdAt: 1, chartId:1 , type: 1 });
        for(let chart of charts ){
            chart.thumbnail = local_URI + '/thumbnail/' + chart.chartId + '.jpg';
        }
        console.log(charts)
        res.json(charts)
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
    
})

router.delete('/deleteChart/:googleId/:chartId', async (req, res) => {
    const googleId = req.params.googleId;
    const chartId = req.params.chartId;

    console.log(chartId);
    try{
        await Chart.findOneAndDelete({ googleId: googleId, chartId: chartId })
        fs.unlinkSync('csv/' + chartId);
        fs.unlinkSync('thumbnails/' + chartId + '.jpg');
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
    
})

router.get('/healthcheck', (req, res) => {
    res.status(200).send('OK')
})

module.exports = router;