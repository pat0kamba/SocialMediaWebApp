const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const userSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required:'The name is required'
    },
    email:{
        type:String,
        required:'Email is required',
        // match:[/.+@+\..+/, 'Please Enter a valid email address'],
        unique:'The email already exists'
    },
    created:{
        type:Date,
        default:Date.now
    },
    updated:{
        type:Date
    },
    hashed_password:{
        type:String,
        // required:'The password is required'
    },
    salt:{
        type:String
    }
 
});

userSchema.virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plaintext){
        return this.encryptPassword(plaintext) === this.hashed_password;
    },
    encryptPassword : function(password){
        if (!password) return "";
        try{
            return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex')
        }catch(error){
            return "";
        }
    },
    makeSalt : function(){
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
} 

// Password field validation
userSchema.path('hashed_password').validate(function(v){
    if (this._password && this._password.length < 6)
    {
        this.invalidate('password', 'Password must be at least 6 characters.');
    }

    if (this.isNew && !this._password){
        this.invalidate('password', 'password is required');
    }
}, null);

module.exports = mongoose.model('user', userSchema);