// place your application-wide javascripts here
$(function () {
  var socket = io.connect()
    , input = $('#input');

  var regex = /^(.*)(\d)+$/i;
  var cloneIndex = $(".clonedfrm").length;

  input.keypress(function (e) {
    if (e.which === 13) {
      socket.emit('set value', input.val());
      input.val('');
      $('h2').text('value set, reload page');
    }
  }).focus();

  socket.on('message', function (data) {
    console.log(data);
  });

  socket.on('newtexto', function (data) {
    $('#chat').append(data.text);
  });

  socket.on('updSource', function (data) {
    $('.video').html(data.source);
  })

  socket.on('getQuizz', function (data) {
    $('#ppt').html(data.html);
  });

  $('#msg').focus();
  $('#msg').keyup(function (event) {
    if (event.which == 13) {
      socket.emit('texto', {text: $(this).val()});
      $(this).val('');
    }
  });
  $('#updSource').click(function () {
    socket.emit('newSource', {source: $('#videoSource').val()});
  });
  $('#mod2in').keyup(function (event) {
    if (event.which == 13) {
      socket.emit('hlword', {text: $(this).val()});
    }
  });
  // $('#pubQuiz').click(function () {
  //   socket.emit('pubQuiz', )
  // })

  $(".ctrlform .clone").live("click", function(e) {
    e.preventDefault();
    cloneIndex++;
    $(this).parents(".clonedfrm").clone()
      .appendTo("#frmQuizz")
      .attr("id", "clonedfrm" +  cloneIndex)
      .find("*").each(function() {
        var id = this.id || "";
        var match = id.match(regex) || [];
        if (match.length == 3) {
          this.id = match[1] + (cloneIndex);
        }
      });
  });

  $(".ctrlform .remove").live("click", function(e) {
    e.preventDefault();
    if ($(".clonedfrm").length > 1)
      $(this).parents(".clonedfrm").remove();
  });

  $("#frmOptions .clone").live("click", function(e) {//DRY
    e.preventDefault();
    $(this).parents(".clonedOption").clone()
      .appendTo("#frmOptions");
  });

  $("#frmOptions .remove").live("click", function(e) {
    e.preventDefault();
    if ($(".clonedOption").length > 1)
      $(this).parents(".clonedOption").remove();
  });

  $('.pubQuizz').click(function (e) {
    var data = {};
    $(".clonedfrm").each(function(ind,val){
      var opts= {};
      $(this).find('.clonedOption').each(function(ind2,val2){
        var _n = $(this).find('.optName').val();
        var _c = $(this).find('.optCheck').is(':checked');
        opts[ind2] = {name: _n, value: _c};
      });
      var _q =$(this).find('.askQu').val();
      var _t =$(this).find('.askTime').val();
      data[ind] = {qu: _q, secs: _t, opts: opts}
    });
    console.log(data);
    socket.emit('pubQuizz', data);
  });
});
