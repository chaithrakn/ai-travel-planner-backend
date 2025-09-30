const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');

const Hotel = require('./models/hotel');
const hotel = require('./models/hotel');
const User = require('./models/user');

// routes
const userRoutes = require('./routes/users');
const hotelRoutes = require('./routes/hotels');

mongoose.connect('mongodb://localhost/sustivo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// to read request body
app.use(express.urlencoded({extended: true}));  
//method override
app.use(methodOverride('_method'));
//static content
app.use(express.static(path.join(__dirname,'public')));

// sessions
const sessionConfig = {
    secret: 'travel2.0',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

// user authentication 
app.use(passport.initialize());
// for persistent login session:
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/', userRoutes);
app.use('/', hotelRoutes);

// invalid api route
// app.use((req,res) => {
//     res.status(404).send('NOT FOUND');
// })

// app.use((err, req, res, next) => {
//     res.send("ERROR!!!");
//     console.log(err);
// })

app.listen(3000, () => {
    console.log('Listening to port 3000..');

})

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 },
    });
  }
