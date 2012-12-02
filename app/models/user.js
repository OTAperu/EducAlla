User.validatesUniquenessOf('email', {message: 'email is taken'});
User.validatesUniquenessOf('username', {message: 'username is taken'});
User.validatesPresenceOf('username', 'email')
