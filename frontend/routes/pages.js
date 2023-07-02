const { auth, isAuthed } = require('../middleware/auth');
const axios = require('axios');
const router = require('express').Router();

const host = process.env.HOST || 'localhost';

router.get('/auth_failed', (req, res) => {
    res.render('error', { error: 'Authentication failed' });
})
router.get('/', (req, res) => {
    res.render('home');
})

router.get('/buyquotas', auth, async (req, res) => {
    try {
        const token = req.cookies['token'];
        const userInfo = (await axios.get(`http://${host}:9001/user-api/getUser/${token}`)).data; //change URLs
        res.render('buyquotas', { email: userInfo.email, image: userInfo.image, name: userInfo.firstName });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
})


router.get('/createChart', auth, async (req, res) => {
    try {
        const token = req.cookies['token'];
        const userInfo = (await axios.get(`http://${host}:9001/user-api/getUser/${token}`)).data;
        res.render('create', { email: userInfo.email, image: userInfo.image, name: userInfo.firstName });

    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }

})

router.get('/dashboard', auth, async (req, res) => {
    try {
        const token = req.cookies['token'];
        const userInfo = (await axios.get(`http://${host}:9001/user-api/getUser/${token}`)).data; //change URLs
        const googleId = userInfo.googleId;
        const userData = (await axios.get(`http://${host}:9003/getCharts/${googleId}`)).data;
        res.render('dashboard', { email: userInfo.email, image: userInfo.image, charts: userData, name: userInfo.firstName });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }


})


router.get('/account', auth, async (req, res) => {
    const token = req.cookies['token'];
    const googleId = req.googleId;
    const userInfo = (await axios.get(`http://${host}:9001/user-api/getUser/${token}`)).data; //change URLs
    const quotas = (await axios.get(`http://${host}:9002/quotas-api/getQuotas/${googleId}`)).data.quotas.quotas;
    const dateString = userInfo.createdAt;
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}h${minutes}`;
    res.render('account', { email: userInfo.email, image: userInfo.image, name: userInfo.firstName, surname: userInfo.lastName, createdAt: formattedDate, quotas: quotas});

})
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})



module.exports = router;