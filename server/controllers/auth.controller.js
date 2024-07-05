require('dotenv').config();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const {expressjwt: Jwt} = require('express-jwt');


const signIn = async (req, res)=>{
    try{
        let user = await User.findOne({email: req.body.email});
        // console.log("Nothing:", user);
        if (!user)
            {
                return res.status(401).json({message:'user not found'});
            }
        if (!user.authenticate(req.body.password))
            {
                console.log("what!!!!!");
                return res.status(400).json({message: 'Email address and password do not match'});
            }
        // User athenticated themselves correctly
        const token = jwt.sign({id:req.body._id}, process.env.KEY);
        res.cookie('t', token, {expire:new Date() + 9999});
        res.status(200).json({token, user:{_id: user._id, name:user.name, email:user.email}});


    }catch(err){
        console.log('Here...');
        res.status(400).json({message:err.message})

    }
};

const signOut = async (req, res)=>{
    try{
        res.clearCookie("t");
        res.status(200).json({message: 'User signed Out succefully'});
    }catch(err){
        res.status(400).json({error: err.message});
    }
};

 const requireSignin = Jwt({secret: process.env.KEY, algorithms: ["HS256"]});

 const hasAuthorization = (req, res, next)=>{
    const authorized = req.profile && req.auth && req.profile.id == req.auth.id;
    if (!authorized)
    {
            res.status(400).json({error:'User Not authorized'});
    }

    next();
 }

 module.exports = {signIn, signOut, requireSignin, hasAuthorization};