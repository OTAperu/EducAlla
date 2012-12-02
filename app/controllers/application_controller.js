before('protect from forgery', function () {
    protectFromForgery('2eb38aa50c7978208103555b9a6dddd113008b9e');
});

before('check if logged', function () {
  if (req.session.user) {
    User.find(req.session.user.id, function (err, user) {
      if (err || !user) {
        this.user = {};
      } else {
        this.user = user;
      }
      next();
    }.bind(this));
  } else {
    this.user = {};
    next();
  }
});

publish('checkPermission', checkPermission);
function checkPermission() {
  if (!session.user) {
    req.session.redirect = req.path;
    flash('info', 'Debes estar registrado para ver esa sección');
    redirect('/login');
  } else {
    next();
  }
}
