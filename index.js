/*----- Required NPM Libraries -----*/
require('dotenv').config()
const Express = require('express')
const ejsLayouts = require('express-ejs-layouts')

/*----- Middleware for app Authentication -----*/
const helmet = require('helmet')
const session = require('express-session')
const flash = require('flash')

/*----- app Setup -----*/
const app = Express()
app.use(Express.urlencoded({ extended: false }))
app.use(Express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(require('morgan')('dev'))
app.use(helmet())

/*----- Routes -----*/
app.get('/', (req, res) => {
    // check to see if user is logged in
    res.render('index')
})

/*----- Controllers -----*/
app.use('/auth', require('./controllers/auth'))

/*----- Initialize app on Port -----*/
app.listen(process.env.PORT || 3000, () => {
    console.log(`🕺 Port: ${process.env.PORT} 💃`)
})