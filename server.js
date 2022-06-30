require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo');
const passport = require('passport')
const Emmiter = require('events')

// Database connection
mongoose.connect("mongodb://localhost:27017/shop", { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.log(error));
// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log('Database connected...');
// }).on('error', () => {
//     console.log('Connection failed...')
// });



// Session store
let mongoStore = MongoDbStore.create({
                mongoUrl: "mongodb://localhost:27017/shop",
                collection: 'sessions'
            })

//Event Emmiter
const eventEmmiter = new Emmiter()
app.set('eventEmmiter',eventEmmiter)

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

//Passport Config
const passportInit = require('./app/config/passport')
const order = require('./app/models/order')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next();
})



// set Template engine
app.use(expressLayout)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/resources/views'))

require('./routes/web')(app)
app.use((req, res) => {
    res.status(404).render('errors/404')
})

const server = app.listen(PORT , () => {
            console.log(`Listening on port ${PORT}`)
        })


const io = require('socket.io')(server)
io.on('connection',(socket)=>{
    //join
    console.log(socket.id)
    socket.on('join',(orderId)=>{
        console.log(orderId)
        socket.join(orderId)
    })
})

eventEmmiter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})


eventEmmiter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})