'use strict';

module.exports = function (app) {

  var User = app.models.User;

  var Role = app.models.Role;

  var RoleMapping = app.models.RoleMapping;


  User.create([
    {username: 'user', email: 'user@doe.com', password: 'user'},
    {username: 'admin', email: 'admin@projects.com', password: 'admin'},
  ], function (err, users) {
    if (err) return err;

    //create the admin role
    Role.create({
      name: 'admin'
    }, function (err, role) {
      if (err) err;

      //make bob an admin
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[2].id
      }, function (err, principal) {
        cb(err);
      });
    });
  });

};
