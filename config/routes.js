exports.routes = function (map) {
  map.resources('users');
  map.resources('lessons');
  map.root('lessons#index');
  map.all('/login', 'users#login');
  map.get('/pop/:id', 'lessons#pop');
  app.get('/logout', function (req, res) {
    delete req.session.user;
    res.redirect('/');
  });
  // Generic routes. Add all your routes below this line
  // feel free to remove generic routes
  // map.all(':controller/:action');
  // map.all(':controller/:action/:id');
};
