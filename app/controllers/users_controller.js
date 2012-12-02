load('application');
var bcrypt = require('bcrypt');

before(loadUser, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New user';
    this.user = new User;
    render();
});

action(function create() {
    saltAndHash(req.body.User.password, function (hash) {
      req.body.User.password = hash;
      createUser();
    });
});

action(function index() {
    this.title = 'Users index';
    User.all(function (err, users) {
        render({
            users: users
        });
    });
});

action(function show() {
    this.title = 'User show';
    render();
});

action(function edit() {
    this.title = 'User edit';
    render();
});

action(function update() {
    this.user.updateAttributes(body.User, function (err) {
        if (!err) {
            flash('info', 'User updated');
            redirect(path_to.user(this.user));
        } else {
            flash('error', 'User can not be updated');
            this.title = 'Edit user details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.user.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy user');
        } else {
            flash('info', 'User successfully removed');
        }
        send("'" + path_to.users() + "'");
    });
});

action(function login() {
  if (req.body.authenticity_token) {
    logUser(req.body.user, req.body.pass, function (err, res) {
      if (err) {
        flash('error', err);
        this.title = 'Login: Error';
        render();
      } else {
        var redir = '/';
        if (req.session.redirect) {
          redir = req.session.redirect;
          delete req.session.redirect;
        }
        response.redirect(redir);
      }
    }.bind(this));
  } else {
    this.title = 'Login';
    render();
  }
});

function loadUser() {
    User.find(params.id, function (err, user) {
        if (err || !user) {
            redirect(path_to.users());
        } else {
            this.user = user;
            next();
        }
    }.bind(this));
}

function saltAndHash (pass, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(pass, salt, function(err, hash) {
      callback(hash);
    });
  });
}

function createUser() {
  User.create(req.body.User, function (err, user) {
    if (err) {
      flash('error', 'User can not be created');
      render('new', {
        user: user,
        title: 'New user'
      });
    } else {
      flash('info', 'User created');
      redirect(path_to.users());
    }
  });
}

function logUser(uname, pass, callback) {
  User.all({where: {username: uname}}, function (err, users) {
    if (err || !users.length>0) {
      callback('Usuario no encontrado');
    } else {
      var user = users[0];
      bcrypt.compare(pass, user.password, function (err, res) {
        if (res) {
          req.session.user = user;
          callback(null, user);
        } else
          callback('Password incorrecto');
      });
    }
  });
}
