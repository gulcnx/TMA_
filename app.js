const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const cors = require('cors');

const app = express();
const PORT = 3000 ;

//MONGODB YE BAĞLAN

const uri = "mongodb+srv://cgulcn777:theghost@cluster0.yyamszc.mongodb.net/?retryWrites=true&w=majority";

async function connect(){
    try {
        await mongoose.connect(uri);
        console.log("connected to mongoDB");
                       
    } catch (error) {
        console.error("mongodb'ye bağlanırken bir hata oluştu", error.message);
    }
}

connect();

//MIDDLEWARE

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'secret', resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//user model
const User = require('./models/User');

//Passport Local Strategy

passport.use(
    new LocalStrategy({usernameField:'email'}, async(email,password,done)=>{
        try {
            const user = await User.findOne({email});
            if(!user){
                return done(null,false,{message:'Incorrect email.'});
            }
            const isMatch= await bcrypt.compare(password,user.password);
            if(!isMatch){
                return done (null,false,{message:'Incorrect password.'});
            }
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
User.findById(id,(err,user)=>{
    done(err,user);
});
});

//Routes

app.post(
    '/login',
    passport.authenticate('local',{
        successRedirect:'/tasks',
        failureRedirect:'/',
        failureFlash:true,
    })
);

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

app.get('/tasks', ensureAuthenticated, async(req,res)=>{
    try {
        const tasks = await Task.find();
        res.render('tasks',{tasks, user:req.user});
        
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/tasks',ensureAuthenticated,async(req,res)=>{
    try {
        const task = new Task({...req.body, user:req.user._id});
        await task.save();
        res.redirect('/tasks');
    } catch (error) {
        res.status(400).send(error);
    }
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Task Manager App');
});

app.listen(PORT , ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});