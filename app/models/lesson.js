Lesson.prototype.dataRoom = function dataRoom () {
  return eval("("+this.data+")");
};
Lesson.prototype.data2Obj = function data2Obj (field,value) {
  var obj = this.data ? eval("("+this.data+")") : {};
  obj[field] = value;
  this.data = JSON.stringify(obj);
  this.updateAttributes(this, function (error) {
    if (error)
      console.log("lesson-model:: error");
  });
};
Lesson.prototype.getData = function getData (field) {
  if (this.data) {
    var obj = eval("("+this.data+")");
    return obj[field];
  } else return ''  ;
}
