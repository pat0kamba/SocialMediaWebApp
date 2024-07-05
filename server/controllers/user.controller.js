const User = require('../models/user.model');
const errorHandler = require('../helpers/dbErrorHandler');
const _ = require('lodash');

const list = async (req, res) => {
    try{
        const users = await User.find().select('name email updated created');
        res.status(200).json(users);
    }catch(err){
        res.status(400).json({error:errorHandler(err)});
    }
}

const create = async (req, res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.status(200).json({message: "successfully signed up"});
    }catch(err)
    {
        res.status(400).json({error: errorHandler(err)});
    }
};

const userById = async(req, res, next, id)=>{
    try{
        const user = User.findById(id);
        if(!user)
        {
            res.status(404).json({message: "User Not Found"});
        }
        req.profile = user;
        // console.log(user)
        next();

    }catch(error)
    {
        res.status(400).json({message:error.message});
    }
}
const read = async(req, res)=>{
    try{
        const user = await req.profile;
    // console.log('User:', user);
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json(user);
    }catch(error){
        res.status(400).json({message:error.message});
    }
    
}

const update = async (req, res)=>{
    try{
        let user = req.profile;
        _.extend(user, req.body);
        user.updated = Date.now();
        await user.save();
        user.hashed_password = undefined;
        user.salt = undefined;
        res.status(200).json(user);
    }catch(err){
        res.status(400).json({error: errorHandler(err)});
    }
};

const remove = async(req, res)=>{
    try{
        const user = req.profile;
        let deleteUser = user.remove();
        deleteUser.hashed_password = undefined;
        deleteUser.salt = undefined;
        res.status(200).json(deleteUser)
    }catch(err)
    {
        res.status(400).json({error:errorHandler(err)});
    }
};

module.exports = {list, create, userById, read, update, remove}