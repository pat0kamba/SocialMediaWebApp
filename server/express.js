// Import usefull packages
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compress = require('compression');
const helmet = require('helmet');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();
// set up the middleware
app.use(cors());
app.options("*", (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-Width');
    res.send(200);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use((err, req, res, next)=>{
    if (err.name === "UnauthorizedError")
    {
        res.status(401).json({"error": err.name, "message":err.message});
    }
    else if(err)
    {
        res.status(400).json({"error":err.name, "message": err.message});
    }
})

module.exports = app;