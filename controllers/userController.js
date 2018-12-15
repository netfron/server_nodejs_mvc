var User = require('../models/user');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.list = function(req, res, next) {

    User.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_users) {
      if (err) { return next(err); }
      // Successful, so render.
      console.log(list_users);
      res.render('user/list', { title: 'User List', list_users:  list_users});
    });

};

exports.detail = function(req, res, next) {

    async.parallel({
        user: function(callback) {
            User.findById(req.params.id)
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        console.log(results.user);
        // Successful, so render.
        res.render('user/detail', { title: 'User Detail', user : results.user } );
    });

};

exports.create_get = function(req, res, next) {
    res.render('user/form', { title: 'Create User'});
};

exports.create_post = [

    // Validate that the name field is not empty.
    body('user_name', 'User name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('user_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var user = new User(
          { 
            user_id: req.body.user_id, 
            user_name: req.body.user_name,
            user_password: req.body.user_password 
          }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('form', { title: 'Create User', user: user, errors: errors.array()});
        return;
        }
        else {

            User.findOne({ 'user_id': req.body.user_id })
                .exec( function(err, found_user) {
                     if (err) { return next(err); }

                     if (found_user) {
                         res.redirect(found_user.url);
                     }
                     else {

                         user.save(function (err) {
                           if (err) { return next(err); }
                           res.redirect(user.url);
                         });

                     }

                 });
        }
    }
];

exports.delete_get = function(req, res, next) {

    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.user==null) { // No results.
            res.redirect('/users');
        }
        // Successful, so render.
        res.render('user/delete', { title: 'Delete User', user: results.user } );
    });

};

exports.delete_post = function(req, res, next) {

    async.parallel({
        user: function(callback) {
            User.findById(req.params.id).exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        console.log(results);
        if (results.user.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('user/delete', { title: 'Delete User', user: results.user } );
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            User.findByIdAndRemove(req.body.id, function deleteUser(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/users');
            });

        }
    });

};

exports.update_get = function(req, res, next) {

    User.findById(req.params.id, function(err, user) {
        if (err) { return next(err); }
        if (user==null) { // No results.
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('user/form', { title: 'Update User', user: user });
    });

};

exports.update_post = [
   
    // Validate that the name field is not empty.
    body('user_name', 'user name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('user_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        console.log(req.params.id);
    // Create a genre object with escaped and trimmed data (and the old id!)
        var user = new User(
          {
            _id : req.params.id,
            user_id: req.body.user_id,
            user_name: req.body.user_name,
            user_password: req.body.user_password,  
          }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('user/form', { title: 'Update User', user: user, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            User.findByIdAndUpdate(req.params.id, user, {}, function (err,theuser) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect(theuser.url);
                });
        }
    }
];
