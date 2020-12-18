const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { create } = require("../models/User");

// error handler:
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errorObject = { email: '', password: ''};

    if (err.message === 'incorrect email') {
        errorObject.email = 'that email is not registered'
    }
    if (err.message === 'incorrect password') {
        errorObject.password = 'that password is incorrect'
    }

    // check for existing username error:
    if (err.code === 11000) {
        errorObject.email = 'That email already exists, please enter another one'
        return errorObject;
    }

    // check for error:
    if (err.message.includes('user validation failed')) {
        // the error param is just the item used for each iteration
        Object.values(err.errors).forEach(error => {
            errorObject[error.properties.path] = error.properties.message;
        });
    }

    return errorObject;
}

const maxAge = 3*24*60*60;
const createToken = (id) => {
   return jwt.sign( {id}, 'secrethash', {expiresIn: maxAge}); 
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

// async allows for the await keyword to be used
module.exports.signup_post = async (req, res) => {
    // let's extract the json
    // var names need to match the json naming:
    const {email, password} = req.body
    
    // include a jwt after a succesful signup:
    try {
        // an asynchronous call to store the created user
        //      inside the local variable
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // passes back json in form of the user that was created 
        res.status(201).json( { user: user._id}); 
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}