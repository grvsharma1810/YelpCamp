var app = require("express")();
var bodyParser = require("body-parser");
app.set("view engine","ejs");

var campgrounds = [
        {name : "Gaurav Sharma", image : "https://images.freeimages.com/images/large-previews/751/orange-splash-1326817.jpg" },
        {name : "Upanshu Kumar", image : "https://images.freeimages.com/images/large-previews/7e9/ladybird-1367182.jpg" },
        {name : "Manish Shah", image : "https://images.freeimages.com/images/large-previews/fa7/kiraz-polis-1640374.jpg" }
];

app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name ;
    var image = req.body.image ;
    var newCampground = {name:name, image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});
app.listen(3000,function(){
    console.log("Server Started");
})