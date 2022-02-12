const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, 'Name is required']
  },
  fullname: {
    type: String,
    // required: [true, 'Fullname is required']
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: EMAIL_PATTERN,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    match: [PASSWORD_PATTERN, 'Password must contain at least 8 chars!']
  },
  googleID: {
    type: String
  },
  image:{
    type: String,
    default:"https://bootdey.com/img/Content/avatar/avatar7.png"
  }
});

userSchema.pre('save', function (next){
  const user = this;

  if (user.isModified('password')){
    bcrypt.hash(user.password, SALT_ROUNDS)
    .then((hash) =>{
      user.password = hash
      next()
    })
    .catch(err => next(err))
  } else {
    next ()
  }
})

userSchema.methods.checkPassword = function(password){
  return bcrypt.compare(password, this.password)
}




const User = mongoose.model('User', userSchema);



module.exports = User;