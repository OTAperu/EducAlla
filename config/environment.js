//require('nodetime').profile();
var express = require('express');

var io = require('socket.io')
  , util = require('util')
  , connect = require('express/node_modules/connect')
  , parseCookie = connect.utils.parseCookie
  //, MemoryStore = connect.middleware.session.MemoryStore
  , RedisStore = require('connect-redis')(express)
  , store
  , _lessons = "lalala";
  //  , _lessons = new Object()

var stylus = require('stylus');

app.configure(function(){
    var cwd = process.cwd();
    app.use(stylus.middleware({src: cwd + '/public', compress: true }));
    app.use(express.static(cwd + '/public', {maxAge: 86400000}));
    app.set('view engine', 'jade');
    app.set('view options', {complexNames: true});
    app.set('jsDirectory', '/javascripts/');
    app.set('cssDirectory', '/stylesheets/');
    app.set('root', cwd);
    app.use(express.bodyParser());
    app.use(express.cookieParser('secret'));
    app.use(express.session({
      secret: 'secret'
    , key: 'express.sid'
    , store: store = new RedisStore()
    }));
    app.use(express.methodOverride());
    app.use(app.router);
});

var sio = io.listen(app);
sio.set('authorization', function (data, accept) {
  if (!data.headers.cookie)
    return accept('No cookie transmitted.', false);

  data.cookie = parseCookie(data.headers.cookie);
  data.sessionID = data.cookie['express.sid'];

  store.load(data.sessionID, function (err, session) {
    if (err || !session) return accept('Error aqui', false);

    data.session = session;
    return accept(null, true);
  });
});
sio.sockets.on('connection', function (socket) {
  var sess = socket.handshake.session;
  socket.join(sess.room);

  socket.log.info('a socket with sessionID', socket.handshake.sessionID , 'connected');

  socket.on('set value', function (val) {
    sess.reload(function () {
      sess.value = val;
      sess.touch().save();
    });
  });

  socket.on('texto', function (data) {
    if (data.text) {

        Lesson.find(sess.roomId, function (err, res) {
          if (err || !res)
            console.log('env,js on texto> find');
          else
            _lessons = res.getData('hlword') || "random987";

          var msgUser = (sess.roomAuthor == sess.user.id) ? '<strong>'+sess.user.username+'</strong>' : sess.user.username;
          var msgData = (data.text.indexOf(_lessons) !== -1) ? '<span class="ok">'+data.text+'</span>' : data.text;

          var mensaje = '<div>'+msgUser+': '+msgData+'</div>';
          sio.sockets.in(sess.room).emit('newtexto', {text: mensaje});
        });

    }
  });

  socket.on('hlword', function (data) {
    _lessons = data.text;
    Lesson.find(sess.roomId, function(err,res){
      if (err || !res)
        console.log('no lesson');
      else
        res.data2Obj('hlword', data.text);
    });
  });

  socket.on('newSource', function (data) {
    socket.broadcast.to(sess.room).emit('updSource', data);
    Lesson.find(sess.roomId, function(err,res){
      if (err || !res)
        console.log('no lesson');
      else
        res.data2Obj('source', data.source);
    });
  });

  socket.on('pubQuizz', function (data) {
    var tplQuizz = getTpl(data);
    socket.broadcast.to(sess.room).emit('getQuizz', {html: tplQuizz});
    Lesson.find(sess.roomId, function(err,res){
      if (err || !res)
        console.log('no lesson');
      else
        res.data2Obj('quizz', tplQuizz);
    });

    //timeout
    // var _time = data.time*1000;
    // console.log(_time);
    // setTimeout(function () {
    //   socket.broadcast.to(sess.room).send('recoger')
    // },_time);
  });

/* end socket */
});

function getLesson (callback) {
  Lesson.find(session.roomId, function(err,res){
    if (err || !res) {
      console.log('no lesson');
      callback('no-lesson');
    } else
      callback(null, res);
  });
}

function getTpl (data) {
  var html = [];
  for (i in data) {
    var opcion = data[i].opts
      , chkbox = 0
      , opciones = [];
    for (x in opcion) {
      if (opcion[x].value)
        chkbox++;
      opciones.push('<div><label class="modelo"><input type="modelo" value='+x+' />'+opcion[x].name+'</label></div>');
    }
    var modelo = (chkbox > 1) ? 'checkbox' : 'radio';
    opciones = opciones.join('').replace(/modelo/g,modelo);
    html.push('<div class="question"><h4>'+data[i].qu+'</h4>'+opciones+'</div>');
  }
  html.push('<div><input type="button" class="btn btn-success" value="Enviar" /></div>');
  return html.join('');
}
