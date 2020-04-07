let express = require("express"),
    app = express(),
    bodyParser = require("body-parser")
    mongoose = require("mongoose"),
    Campground = require("./models/campground.js"),
    Comment = require("./models/comment.js"),
    seedDB = require("./seed.js"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user.js"),
    expressSession = require("express-session"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

mongoose.connect('mongodb://localhost/yelp_camp_v12', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIG
app.use(expressSession({
    secret: "xyz is great",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

let authRoute = require("./routes/index.js"),
    commentRoute = require("./routes/comments.js"),
    campgroundRoute = require("./routes/campgrounds.js");

app.use("/", authRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/campgrounds", campgroundRoute);

//LISTEN
app.listen(3000,function(){
    console.log("SERVER STARTED!");
});