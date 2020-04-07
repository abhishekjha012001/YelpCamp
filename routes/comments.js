let express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground.js"),
    Comment = require("../models/comment.js"),
    middleware = require("../middleware");

//COMMENT NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds/" + req.params.id);
        }
        else
            res.render("comments/new.ejs", { campground: campground });
    });
});

//COMMENT CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err)
            res.redirect("/campgrounds/" + req.params.id);
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err)
                    res.redirect("/campgrounds/" + req.params.id);
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(function(err,comment){
                        if(err)
                            console.log(err);
                        else{
                            campground.comments.push(comment);
                            campground.save(function (err, campground) {
                                if (err)
                                    res.redirect("/campgrounds/" + req.params.id);
                                else{
                                    req.flash("success", "Successfully added comment");
                                    res.redirect("/campgrounds/" + req.params.id);
                                }
                                    
                            });
                        }
                    });
                };                    
            });
        }
    });
});

//COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function (err, campground) {
        if (err || !campground) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds/" + req.params.id);
        }
        else{
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                }
                else
                    res.render("comments/edit.ejs", { campgroundId: req.params.id, comment: foundComment });
            });
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,comment){
        if(err)
            res.redirect("back");
        else    
            res.redirect("/campgrounds/"+req.params.id);
    })
});

//DESTROYS GIVEN COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
            res.redirect("back");
        else{ 
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;