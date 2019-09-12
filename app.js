var express            = require("express"),
    bodyParser         = require("body-parser"),
    mongoose           = require("mongoose"),
    passport           = require("passport"),
    LocalStrategy      = require("passport-local"),
    Campground         = require("./models/campground"),
    Comment            = require("./models/comment"),
    seedDB             = require("./seeds");
    User               = require("./models/user")
var app = express();


//Passport Configration
app.use(require("express-session")({
    secret:"Once again Rusty wins cutest dog!",
    resave:false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))

app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    })    
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name ;
    var image = req.body.image ;
    var dsc = req.body.description;
    var newCampground = {name:name, image:image,description:dsc};
    //campgrounds.push(newCampground);
    Campground.create(newCampground,function(err,newlycampground){
        if(err){
            console.log(err);
        } else{
            console.log(newlycampground);
            res.redirect("/campgrounds");      
        }
    })    
});

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
})

// COMMENT ROUTES

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new",{campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments",function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else{
            Comment.create(req.body.comment,function(err,comment){
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/"+campground._id);
            });
        }
    });
});

// ======================
// AUTH ROUTES
// ===================

//show register form
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds")
        });
    });
});

app.listen(3000,function(){
    console.log("Server Started");
})