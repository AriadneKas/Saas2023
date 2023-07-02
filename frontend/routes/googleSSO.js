const axios = require('axios');
const router = require('express').Router();
const { auth , isAuthed }= require('../middleware/auth');
const { authNewUser , isAuthedNewUser}= require('../middleware/authNewUser');

const host = process.env.HOST || 'localhost';

router.post('/googleSSO', async (req, res) => {
    try {
        const { data } = await axios.post(`http://${host}:9001/user-api/login/google`, req.body);

        const token = data.token;
        const isNewUser = data.isNewUser;
        res.cookie('token', token)
        if (isNewUser) {
            res.redirect(`/login/confirm`)
        } else {
            res.redirect('/dashboard');
        }

    } catch (err) {
        console.log('The error lies here');
        res.render('error',  {error: 'User authentication service is unavailable. Please try again later.'});
    }
    
})

router.get('/confirm', authNewUser, (req, res) => {
    const email = req.email;
    res.render('approve', {email: email});
})

router.get('/confirm/approve', authNewUser, async (req, res) => {
    const googleId = req.googleId;
    try{
        const { data } = await axios.get(`http://${host}:9001/user-api/exchangetoken/${googleId}`);
        const token = data.token;
        const isNewUser = data.isNewUser;
        res.cookie('token', token)
        if(!isNewUser){
            res.redirect('/dashboard');
        } else {
            res.render('error')
        }
    } catch(err){
        console.log('The error lies here', err);
        res.render('error', {error: 'User authentication service is unavailable. Please try again later.'});
    }   
})

router.get('/confirm/disapprove', authNewUser, async (req, res) => {
    const googleId = req.googleId;
    try{
        const { data } = await axios.delete(`http://${host}:9001/user-api/undoUser/${googleId}`,);
        //res.cookie('token', data.token);
        res.redirect('/');
    } catch(err){
        console.log('Disapprove error');
    }
})
module.exports = router;