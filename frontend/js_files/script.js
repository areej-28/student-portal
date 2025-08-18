var STORAGE_KEY = 'students';

function loadStudents() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}
function saveStudents(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

$(function () {
    var students = loadStudents();
    var $form = $('#studentForm');
    var $tbody = $('#studentsBody');
    var $msg = $('#msg');

    function render() {
        $tbody.empty();
        for (var i = 0; i < students.length; i++) {
            var s = students[i];
            var $tr = $('<tr>');
            $('<td>').text(i + 1).appendTo($tr);
            $('<td>').text(s.name).appendTo($tr);
            $('<td>').append($('<a>').attr('href', 'mailto:' + s.email).text(s.email)).appendTo($tr);
            $('<td>').text(s.age).appendTo($tr);
            $tbody.append($tr);
        }
    }

    $form.on('submit', function (e) {
        e.preventDefault();
        $form.addClass('was-validated');
        if (!$form[0].checkValidity()) return;

        var name = $.trim($('#name').val());
        var email = $.trim($('#email').val());
        var age = parseInt($('#age').val(), 10);

        students.push({ name: name, email: email, age: age });
        saveStudents(students);
        render();

        $msg.removeClass('d-none');
        setTimeout(function () { $msg.addClass('d-none'); }, 1200);

        $form[0].reset();
        $form.removeClass('was-validated');
    });

    render();
});
