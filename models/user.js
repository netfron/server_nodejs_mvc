var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    user_id: {type: String, required: true, min: 6, max: 100},
    user_name: {type: String, required: true, min: 4, max: 100},
    user_password: {type: String, required: true, min: 8, max: 100}
},{ collection: 'Users' });

// Virtual for this genre instance URL.
UserSchema
.virtual('url')
.get(function () {
  return '/users/'+this._id;
});

// Export model.
module.exports = mongoose.model('User', UserSchema);
