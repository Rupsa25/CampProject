if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL;
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo')(session);
// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl);

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const secret = process.env.SECRET;
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

app.set('view engine', 'ejs'); //setting the templating method



//Error handling
const ExpressError = require('./utils/ExpressError');

//requiring capmgrounds routes
const campgrounds = require('./routes/campgrounds');
//requiring reviews routes
const reviews = require('./routes/reviews');
//requiring user routes
const userRoutes = require('./routes/users');

//sessions
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//how to store and unstore user data in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})






//for parsing data for post requests
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '/views'));



//all campgrounds routes
app.use('/campgrounds', campgrounds);

//all reviews routes
app.use('/campgrounds/:id/reviews', reviews);

//all users routes
app.use('/', userRoutes);

//Home page
app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT_num || 3000;
app.listen(port, (req, res) => {
    console.log(`Connected to port ${port}`);
})
