load('application');

before(use('checkPermission'), {only: ['show']});
before(loadLesson, {only: ['show', 'edit', 'update', 'destroy', 'pop']});

action('new', function () {
    this.title = 'New lesson';
    this.lesson = new Lesson;
    render();
});

action(function pop() {
  this.title = this.lesson.title;
  render({layout: false});
})

action(function create() {
    Lesson.create(req.body.Lesson, function (err, lesson) {
        if (err) {
            flash('error', 'Lesson can not be created');
            render('new', {
                lesson: lesson,
                title: 'New lesson'
            });
        } else {
            flash('info', 'Lesson created');
            redirect(path_to.lessons());
        }
    });
});

action(function index() {
    this.title = 'Lessons index';
    Lesson.all(function (err, lessons) {
        render({
            lessons: lessons
        });
    });
});

action(function show() {
    this.title = 'Lesson show';
    req.session.room = req.path;
    req.session.roomId = req.params.id;
    req.session.roomAuthor = this.lesson.author;
    render();
});

action(function edit() {
    this.title = 'Lesson edit';
    render();
});

action(function update() {
    this.lesson.updateAttributes(body.Lesson, function (err) {
        if (!err) {
            flash('info', 'Lesson updated');
            redirect(path_to.lesson(this.lesson));
        } else {
            flash('error', 'Lesson can not be updated');
            this.title = 'Edit lesson details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.lesson.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy lesson');
        } else {
            flash('info', 'Lesson successfully removed');
        }
        send("'" + path_to.lessons() + "'");
    });
});

function loadLesson() {
    Lesson.find(params.id, function (err, lesson) {
        if (err || !lesson) {
            redirect(path_to.lessons());
        } else {
            this.lesson = lesson;
            next();
        }
    }.bind(this));
}
