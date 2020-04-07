let express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground.js"),
    middleware = require("../middleware/index.js");

router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err)
            console.log(err);
        else
            res.render("campgrounds/index.ejs", { campgrounds: campgrounds });
    });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id : req.user._id,
        username : req.user.username
    };
    let newcampground = { name: name, image: image, description: desc ,author: author, price: price};
    Campground.create(newcampground, function (err, campground) {
        if (err)
            console.log(err);
        else
            res.redirect("/campgrounds");
    });
});

//SHOW: Shows more info about each campground
router.get("/:id", function (req, res) {
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");   
        }
        else
            res.render("campgrounds/show.ejs", { campground: foundCampground });
    });
});

//EDIT: Shows edit form for each campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
        else
            res.render("campgrounds/edit.ejs", {campground: foundCampground});
    });
});

//UPDATE: Update given campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    let campground = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, campground, function(err,campground){
        if(err)
            res.redirect("/campgrounds");
        else 
            res.redirect("/campgrounds/"+req.params.id);
    });
});

//DESTROY: Detroys given campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("/campgrounds");
        else   
            res.redirect("/campgrounds");
    });
});

module.exports = router;