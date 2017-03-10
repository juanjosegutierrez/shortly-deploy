var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new Schema({
  username: { type: String, index: { unique: true } },
  password: { type: String }  
});

var User = mongoose.model('User', userSchema);
User.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if (err) {
      callback(err);
    } else {
      callback(null, isMatch);
    }
  });
};

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
});

module.exports = User;
