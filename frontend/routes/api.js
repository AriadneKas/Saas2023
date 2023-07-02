const fs = require('fs');
const multer = require('multer');
const {auth} = require('../middleware/auth');
const FormData = require('form-data');
const path = require('path');
const axios = require('axios');
const router = require('express').Router();

const upload = multer({ dest: 'uploads/' });

const host = process.env.HOST || 'localhost'

const chartdbURL = `http://${host}:9003/storeChart`;
const chartCreateURL = `http://${host}:9004/getChart`;
const chartPreviewURL = `http://${host}:9004` //change depending on type, send to create-chart ms
const deleteChartURL = `http://${host}:9003/deleteChart`; // send to db ms
const quotasURL = `http://${host}:9002/quotas-api/getQuotas`; // send to db ms

router.get('/download/:type/:format/:chartId/:token', auth, async (req, res) => {
    const type = req.params.type || 'type';
    const format = req.params.format;
    const chartId = req.params.chartId;
    if (format && type && chartId) {
        const tempPath = path.join(__dirname, 'uploads', '..', `${chartId}.${format}`);
        const requestURL = `${chartCreateURL}/${format}/${chartId}`;
        try {
            const { data } = await axios.get(requestURL, { responseType: 'stream' });
            data.pipe(fs.createWriteStream(tempPath)).on('finish', () => {
                res.sendFile(tempPath, (err) => {
                    fs.unlinkSync(tempPath);
                });
            }).catch(err => {
                console.log(err.message);
                res.status(500).send('Error in downloading file');
            });
        } catch {
            (err) => {
                console.log(err.message);
                res.status(500).send('Error in downloading file');
            };
        }
    } else {
        res.status(400).send('Bad Request');
    }

})


router.get('/checkQuotas', auth, async (req, res) => {
    const googleId = req.googleId;
    const url = `${quotasURL}/${googleId}`;
    try{
        const { data } = await axios.get(url);
        const quotas = data.quotas.quotas;
        if (Number(quotas) > 0) {
            res.json({ ok: true, quotas: quotas });
        } else {
            res.json({ ok: false, quotas: quotas });
        }
    } catch (err) {
        res.status(500).send('Error in checking quotas');
    }
})


router.delete('/deleteChart/:chartId', auth, async (req, res) => {
    const googleId = req.googleId;
    const chartId = req.params.chartId;
    const url = `${deleteChartURL}/${googleId}/${chartId}`;
    try {
        await axios.delete(url);
        res.send('Chart deleted successfully');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Error in deleting chart');
    }
})



router.post('/upload/:type/:chartCSV', auth, async (req, res) => {
    const type = req.params.type;
    const googleId = req.googleId;
    const chartCSV = req.params.chartCSV;
    const formData = new FormData();
    const url = `${chartdbURL}/${type}/${googleId}`;
    const csvPath = path.join(__dirname,'..','uploads', chartCSV);
    const imgPath = path.join(__dirname,'..','public','temp_imgs', `${chartCSV}.jpg`);
    try {
        const fileData = fs.readFileSync(csvPath);
        formData.append('file', fileData, chartCSV);
    } catch (err) {
        res.status(500).send('Error in reading file');
    }
    axios.post(url, formData, {
        headers: formData.getHeaders()
    }).then(result => {
        fs.unlinkSync(csvPath);
        fs.unlinkSync(imgPath);
        res.status(200).send('File uploaded successfully')
    }).catch(err => {
        console.log(err.message);
        res.status(500).send('Error in uploading file');
    })
})

router.delete('/rejectChart/:chartCSV', auth, async (req, res) => {
    const chartCSV = req.params.chartCSV
    const csvPath = path.join(__dirname,'..','uploads', chartCSV);
    const imgPath = path.join(__dirname,'..','public','temp_imgs', `${chartCSV}.jpg`);
    try{
        fs.unlinkSync(csvPath);
        fs.unlinkSync(imgPath);
        res.send('Chart rejected')
    } catch (err) {
        res.status(500).send('Error in deleting', err.message);
    }
})




router.post('/generateChart', auth, upload.single('file'), async (req, res) => {
    const type = req.body.type;
    const googleId = req.googleId;
    const file = req.file;
    const formData = new FormData();
    const url = `${chartPreviewURL}`; //change according to type
    try {
        const fileData = fs.readFileSync(file.path);
        formData.append('file', fileData, file.originalname);
    } catch (err) {
        res.status(500).send('Error in reading file');
    }
    try {
        const { data } = await axios.post(`${url}/getThumbnail`, formData, {
            headers: formData.getHeaders(),
            responseType: 'stream'
        })
        const imgPath = path.join(__dirname,'..','public','temp_imgs',`${file.filename}.jpg`)
        data.pipe(fs.createWriteStream(imgPath));
        res.json({
            preview: `http://localhost/public/temp_imgs/${file.filename}.jpg`,
            imgId: file.filename,
            type: type
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message});
    }
})


router.put('/buyquotas/:quantity', auth, async (req, res) => {
    const quantity = req.params.quantity;
    const googleId = req.googleId;
    try {
        const { data } = await axios.put(`http://${host}:9002/quotas-api/add/${googleId}/${quantity}`);
        res.json({quotas: data.quotas});
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Error in buying quotas');
    }
})

module.exports = router;