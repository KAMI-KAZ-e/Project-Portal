var express = require('express');
var app = express();
var path = require('path');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./public/models/user');
var controller = require('./public/controller/controller');

mongoose.connect('mongodb://localhost:27017/portalProject');
 
app.use(require('express-session')({
    secret: "portal project",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: true}));



app.get('/',function(req,res){
   res
    .status(200)
    .sendFile(path.join(__dirname,'public','login.html'));
});

app.get('/studentLogin',isLoggedIn, function(req,res){
   res
   .status(200)
   .sendFile(path.join(__dirname,'public','student.html'));
});
app.post('/studentLogin', passport.authenticate("local",{
   successRedirect: "/studentLogin",
   failureRedirect:"/"

 }) ,function(req, res){
   });

app.get('/adminLogin',function(req,res){
   res
   .status(200)
   .sendFile(path.join(__dirname,'public','admin.html'));
});

app.post('/adminLogin',function(req,res){
   req.body.username
   req.body.password
   User.register(new User({username:req.body.username}), req.body.password, function(err, user){
      if(err){
         console.log(err);
        
      }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/")  
      });
   });
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/");
}



  
// Creating server 
const port = 3000; 
app.listen(port, () => { 
    console.log("Server running at port: " + port); 
}); 