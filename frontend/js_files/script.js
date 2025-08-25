
var STUDENTS_KEY = 'students';

function loadStudents() {
  try { return JSON.parse(localStorage.getItem(STUDENTS_KEY)) || []; }
  catch (e) { return []; }
}


$(function () {

  function adjust() {
    var nh = $('.navbar.fixed-top').outerHeight() || 0;
    var fh = $('footer.fixed-bottom').outerHeight() || 0;
    $('body').css({ paddingTop: nh, paddingBottom: fh });
  }
  adjust();
  $(window).on('resize', adjust);

  var $form = $('#searchForm');
  var $query = $('#queryId');
  var $tbody = $('#studentsBody');
  var $resultWrap = $('#resultWrap');
  var $resultBody = $('#resultBody');

  var all = loadStudents();  
  renderTable(all);        
  hideResult();

  $form.on('submit', function (e) {
    e.preventDefault();
    $form.addClass('was-validated');
    if (!$form[0].checkValidity()) return;

    var sid = $.trim($query.val());
    if (!sid) return;

    var students = loadStudents(); 
    var match = students.find(function (s) { return s.studentId === sid; });

    if (match) {
      showResult(match);
      renderTable([match]); 
    } else {
      hideResult();
      renderTable([]);     
      alert('No student found with ID: ' + sid);
    }
  });

  $('#resetBtn').on('click', function () {
    $form.removeClass('was-validated')[0].reset();
    hideResult();
    renderTable(loadStudents());
    $query.focus();
  });

  function renderTable(list) {
    $tbody.empty();
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      var $tr = $('<tr>');
      $('<td>').text(i + 1).appendTo($tr);
      $('<td>').text(s.studentId || '').appendTo($tr);
      $('<td>').text(s.name || '').appendTo($tr);
      $('<td>').append($('<a>').attr('href', 'mailto:' + (s.email || '')).text(s.email || '')).appendTo($tr);
      $('<td>').text(s.age != null ? s.age : '').appendTo($tr);
      $('<td>').text(s.major || '').appendTo($tr);
      $('<td>').text(s.semester || '').appendTo($tr);
      $('<td>').text(s.courses || '').appendTo($tr);
      $tbody.append($tr);
    }
    if (!list.length) {
      var $tr = $('<tr>');
      $('<td>').attr('colspan', 8).addClass('text-center text-muted py-3').text('No results').appendTo($tr);
      $tbody.append($tr);
    }
  }

  function showResult(s) {
    $resultBody.html(
      '<div class="row g-2">' +
        item('Student ID', s.studentId) +
        item('Name', s.name) +
        item('Email', s.email) +
        item('Age', s.age) +
        item('Major', s.major) +
        item('Current Semester', s.semester) +
        item('Courses (this semester)', s.courses) +
      '</div>'
    );
    $resultWrap.removeClass('d-none');
  }

  function hideResult() {
    $resultWrap.addClass('d-none');
    $resultBody.empty();
  }

  function item(label, value) {
    value = (value === undefined || value === null || value === '') ? '-' : value;
    return (
      '<div class="col-12">' +
        '<div class="d-flex"><div class="me-2 fw-semibold">' + escapeHtml(label) + ':</div>' +
        '<div>' + escapeHtml(String(value)) + '</div></div>' +
      '</div>'
    );
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
});
