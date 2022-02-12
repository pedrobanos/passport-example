
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User.model')


module.exports.register = (req, res, next) => {
  res.render('auth/register', )
}

module.exports.doRegister =(req, res, next) => {
  const user = { name, email, password } = req.body
  
  const renderWithErrors = (errors) => {
    res.render('auth/register',{
      errors,
      user
    })
  }
  User.findOne({ email })
  .then((userFound) =>{
    if(userFound) {
      renderWithErrors({ email: 'Invalid Email or Password'})
    } else {
      return User.create(user).then(() => res.redirect('/'))
    }
  })
  .catch(err => {
    if(err instanceof mongoose.Error.ValidationError){
      renderWithErrors(err.errors)
    }else{
      console.log('ERROR')
      next(err)
    }
  })
}

module.exports.login = (req, res, next) => {
  res.render('auth/login', )
}


module.exports.doLogin = (req,res, next) =>{
  passport.authenticate('local-auth', (err, user, validation) =>{
    if (err){
      next (err)
    }else if (!User){
      res.status(404).render('auth/login', { errorMessage: validation.error })
    }else {
      req.login(user, (loginError) =>{
        if(loginError){
          next(loginError)
        }else  {
          res.redirect('/profile')
        }      
      })
    }
  }) (req,res, next) 
}

module.exports.logout = (req, res, next) =>{
  req.logout()
  res.redirect('/profile')
}