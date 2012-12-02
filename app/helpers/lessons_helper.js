module.exports = {
  loadFiles: function (lessonId) {
    var fs = require('fs');
    return fs.readdirSync(app.root+'/public/lessons/'+lessonId);
  }
};
