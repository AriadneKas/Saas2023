const { produceThumbnail, producehtml, producejpg, producepdf, producesvg } = require('../util/produce.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const router = require('express').Router()
const storage = multer({ dest: 'uploads/' })


const host = process.env.HOST || 'localhost';
const chartdbURL = `http://${host}:9003/getCSV`


//watch out for paths
router.post('/getThumbnail', storage.single('file'), async (req, res) => {
    const file = req.file;
    const absPathCSV = path.join(__dirname, '..', 'uploads', file.filename);
    const absPathjpg = path.join(__dirname, '..', 'charts', `${file.filename}.jpg`);
    try {
        await produceThumbnail(absPathCSV, absPathjpg);
        const fileStream = fs.createReadStream(absPathjpg);
        fileStream.pipe(res).on('finish', () => {
            fs.unlink(absPathjpg, (err) => {
                if (err) console.log('Can not delete created files', err);
            })
            fs.unlink(absPathCSV, (err) => {
                if (err) console.log('Can not delete created files 2', err);
            })
        }).catch((err) => {
            console.log('Can not create thumbnail', err);
            res.status(500).send(err)
        })
    } catch (err) {
        console.log('Can not create thumbnail', err);
        res.status(500).send(err);
    }

});



router.get('/healthcheck', (req, res) => {
    res.send("App running");
})


router.get('/getChart/:format/:chartId', async (req, res) => {

    const format = req.params.format;
    const chartId = req.params.chartId;

    let formatConstructor = undefined;
    switch (format) {
        case 'jpg':
            formatConstructor = producejpg;
            break;
        case 'pdf':
            formatConstructor = producepdf;
            break;
        case 'svg':
            formatConstructor = producesvg;
            break;
        case 'html':
            formatConstructor = producehtml;
            break;
        default:
            console.log('Invalid format');
            break;
    }
    if (!formatConstructor) {
        return res.status(400).send('Invalid format');
    }
    const tempPath = path.join(__dirname, '..', 'uploads', `${chartId}.${format}`);
    const tempCSVPath = path.join(__dirname, '..', 'uploads', `${chartId}.csv`);
    try {
        const { data } = await axios.get(`${chartdbURL}/${chartId}`, { responseType: 'stream' });
        data.pipe(fs.createWriteStream(tempCSVPath)).on('finish', async () => {
            await formatConstructor(tempCSVPath, tempPath);
            fs.unlink(tempCSVPath, (err) => {
                if (err) console.log('Can not delete created files', err);
            })
            const fileStream = fs.createReadStream(tempPath);
            fileStream.pipe(res).on('finish', () => {

                fs.unlink(tempPath, (err) => {
                    if (err) console.log('Can not delete created files 2', err);
                })
            });
        })
    } catch {
        (err) => {
            console.log(err.message);
            res.status(500).send('Error in downloading file');
            return;
        };
    }


})

router.use((req, res) => {
    res.status(404).send("Resource not found, check URL and try again")
})

module.exports = router
