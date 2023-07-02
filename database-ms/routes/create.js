const router = require('express').Router();
const Chart = require('../models/chart.js')
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: 'csv/' });


const port = process.env.PORT || 9003;

const host = process.env.HOST || 'localhost';
const dbHost = process.env.DB_HOST || '127.0.0.1'
const dbPort = process.env.DB_PORT || 27017;

const local_URI = `http://${host}:${port}`;
const db_URI = `mongodb://${dbHost}:${dbPort}/chartDB`;

function chartServerPort(type) {
    switch (type) {
        case ('polar-area'): 
            return `http://${host}:9004`;
            break;
    }
}

router.get('/thumbnail/:img', async (req, res) => {
    const image = req.params.img;
    const imagePath = path.join(__dirname, '..', 'thumbnails', image);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }

})


router.get('/getCSV/:chartId', async (req, res) => {
    const chartId = req.params.chartId;
    const absPathCSV = path.join(__dirname, '..', 'csv', `${chartId}`);
    if (fs.existsSync(absPathCSV)) {
        const fileStream = fs.createReadStream(absPathCSV);
        fileStream.pipe(res)
    } else {
        res.status(404).send('Chart CSV not found');
    }


})

router.post('/storeChart/:type/:googleId', upload.single('file'), async (req, res) => {
    const file = req.file;
    const googleId = req.params.googleId;
    const type = req.params.type;
    const imgPath = path.join(__dirname,'..','thumbnails', `${file.filename}.jpg`);
    const formData = new FormData();
    try {
        const fileData = fs.readFileSync(file.path);
        formData.append('file', fileData, file.originalname);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(err.message);
    }
    try {
        const { data } = await axios.post(`${chartServerPort(type)}/getThumbnail`, formData, {
            headers: formData.getHeaders(),
            responseType: 'stream'
        })
        data.pipe(fs.createWriteStream(imgPath));
        const newChart = await Chart.create({ googleId: googleId, csv: file.path, type: type, thumbnail: imgPath, chartId: file.filename });
        res.send("Chart uploaded successfully");

    } catch (err) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
})


module.exports = router;