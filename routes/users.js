const express = require('express');
const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req,res) => {
    res.render('users/register');
})

router.post('/register', async(req,res) => {
    const { email, username, password } = req.body;
    const user = new User({email,username});

    const registeredUser = await User.register(user, password);
    //console.log(registeredUser);

    req.login(registeredUser, (err)=> {
        if (err) next(err);
        else {
            req.flash('success', 'Welcome to Sustivo');
            res.redirect('/hotels');
        }
    });
    
})

router.get('/login', (req,res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req,res) => {
    req.flash('success', 'Welcome Back!');
    const returnUrl = req.session.returnTo || '/hotels'
    res.redirect(returnUrl);
})

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/hotels');
})

module.exports = router;