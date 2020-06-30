const express = require('express')
const router = express.Router()
const db = require('../models')
const flash = require('flash')
const passport = require('../config/ppConfig')

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', (req, res) => {
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    }).then(([user, created]) => {
        if (created) {
            // auth
            console.log(`🤘 User created. 🤘`)
            res.redirect('/')
        } else {
            console.log(`👎 User email exists. 👎`)
            req.flash('error', 'Email already exists. Please try again.')
            res.redirect('/auth/register')
        }
    }).catch((err) => {
        console.log(`🚦 ${err.message}\n${err} 🚦`)
        req.flash('error', err.message)
        res.redirect('/auth/register')
    })
})

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (!user) {
            req.flash('error', 'Invalid username or password.')
            req.session.save(() => {
                return res.redirect('/auth/login')
            })
        }
        if (error) {
            return next(error)
        }
        req.login((user, error) => {
            if (error) next(error)
            req.flash('success', 'You are validated and logged in.')
            req.session.save(() => {
                return res.redirect('/')
            })
        })
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'auth/login',
    successFlash: 'Welcome to our app!',
    failureFlash: 'Invalid username or password.'
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router