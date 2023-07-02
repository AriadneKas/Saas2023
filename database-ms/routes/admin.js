const router = require('express').Router();
const Chart = require('../models/chart.js')
const fs = require('fs');
const path = require('path');

router.get('/flushall', async (req, res) => {
    try {
        Chart.deleteMany({}).then((result)=>{
            console.log(result);
        }).catch((err)=>{ console.log(err.message); });
        const directoryCSV = path.join(__dirname, '..', 'csv');
        const directoryThumbnails = path.join(__dirname, '..', 'thumbnails');
        fs.readdir(directoryCSV, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directoryCSV, file), (err) => {
                    if (err) throw err;
                });
            }
        });
        fs.readdir(directoryThumbnails, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directoryThumbnails, file), (err) => {
                    if (err) throw err;
                });
            }
        });

        res.status(200).send('All charts cleared');
    } catch (err) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
})

module.exports = router;