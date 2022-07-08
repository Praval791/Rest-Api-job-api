const mongoose = require('mongoose')
const bcryptJs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Name'],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please Provide Email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please Provide Valid Email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password'],
        minLength: 6,
    },
})
//mongoose middleware
userSchema.pre('save', async function () {
    const salt = await bcryptJs.genSalt(10)
    this.password = await bcryptJs.hash(this.password, salt)
})

//methods that will be the methods of mongoose model
// userSchema.methods.getName = function () {
//     return this.name
// }
userSchema.methods.createToken = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JET_LIFETIME })
}
userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcryptJs.compare(candidatePassword, this.password);
    return isMatch;
}
module.exports = mongoose.model('User', userSchema)
