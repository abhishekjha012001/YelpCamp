let express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground.js"),
    User = require("../models/user.js"),
    passport = require("passport");

router.get("/", function (req, res) {
    res.render("landing.ejs");
});

//REGISTER
router.get("/register", function (req, res) {
    res.render("register.ejs");
});

router.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message); 
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp "+user.username); 
            res.redirect("/campgrounds/");
        })  
    });
});

//LOGIN
router.get("/login", function (req, res) {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {
});

//LOGOUT
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "SUCCESSFULLY LOGGED OUT!");
    res.redirect("/");
});

module.exports = router;