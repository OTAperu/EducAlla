require('../test_helper.js').controller('lessons', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        data: '',
        author: '',
        grade: '',
        cat: ''
    };
}

exports['lessons controller'] = {

    'GET new': function (test) {
        test.get('/lessons/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/lessons', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Lesson.find;
        Lesson.find = sinon.spy(function (id, callback) {
            callback(null, new Lesson);
        });
        test.get('/lessons/42/edit', function () {
            test.ok(Lesson.find.calledWith('42'));
            Lesson.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Lesson.find;
        Lesson.find = sinon.spy(function (id, callback) {
            callback(null, new Lesson);
        });
        test.get('/lessons/42', function (req, res) {
            test.ok(Lesson.find.calledWith('42'));
            Lesson.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var lesson = new ValidAttributes;
        var create = Lesson.create;
        Lesson.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, lesson);
            callback(null, lesson);
        });
        test.post('/lessons', {Lesson: lesson}, function () {
            test.redirect('/lessons');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var lesson = new ValidAttributes;
        var create = Lesson.create;
        Lesson.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, lesson);
            callback(new Error, lesson);
        });
        test.post('/lessons', {Lesson: lesson}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Lesson.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/lessons/1', new ValidAttributes, function () {
            test.redirect('/lessons/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Lesson.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/lessons/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

