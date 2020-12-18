const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


// the Schema is what defines the structure
//      of the Schema document(class)
const userSchema = new mongoose.Schema({
    email: {
        // each field can be formatted as an array where the 
        //      first element will be the wanted value and 
        //      second element will be a custom error message
        type: String,
        required: [true, 'no email was entered'],
        unique: true,
        lowercase: true,
        // can also include a validate field which was consider
        //      the value of the email to see if it's valid:
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'no password was entered'],
        minlength: [6, 'Your password needs to be >= 6 chars']
    }
})

userSchema.post('save', function (doc, next) {
    // we can access the doc param because it's after we saved it
    console.log(this, 'after we saved to DB')
    next();
})

// also the place in which we'll hash the user's password:
userSchema.pre('save', async function (next) {
    // the {this} keyword refers to the user instance created
    //      note that {this} reference is not possible with arrow function
    // {this} would refer to the user instance before it is saved to DB

    // generate the salt for our password for additional security:
    const salt = await bcrypt.genSalt();
    // hash the password:
    this.password = await bcrypt.hash(this.password, salt);
});

// static funciton to login user:
userSchema.statics.login = async function(email, password) {
    // get user back from DB if it exists
    const user = await this.findOne({email});
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

// the first param will have to be the singular of what 
//      we defined to be the collections name in mongoDB
//      mongoose will automatically recognize it under the hood
const User = mongoose.model('user', userSchema);

// other files can now interact with the User collection in the DB
module.exports = User;