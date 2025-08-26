var STUDENTS_KEY = 'students';

function loadStudents() {
  try { return JSON.parse(localStorage.getItem(STUDENTS_KEY)) || []; }
  catch (e) { return []; }
}
function saveStudents(a){
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(a || []));
}
function loadUsers(){
  try { return JSON.parse(localStorage.getItem('users')) || []; }
  catch(e){ return []; }
}
function saveUsers(a){
  localStorage.setItem('users', JSON.stringify(a || []));
}

$(function () {
  if (!requireRole('admin')) return;

  function adjust() {
    var nh = $('.navbar.fixed-top').outerHeight() || 0;
    var fh = $('footer.fixed-bottom').outerHeight() || 0;
    $('body').css({ paddingTop: nh, paddingBottom: fh });
  }
  adjust(); $(window).on('resize', adjust);

  var $form = $('#searchForm');
  var $query = $('#queryId');
  var $tbody = $('#studentsBody');
  var $resultWrap = $('#resultWrap');
  var $resultBody = $('#resultBody');

  var DL_ID = 'dl_queryId';
  if (!document.getElementById(DL_ID)) {
    $query.attr('list', DL_ID);
    $('body').append('<datalist id="' + DL_ID + '"></datalist>');
  }
  var $datalist = $('#' + DL_ID);

  var all = loadStudents();
  var cleaned = all.filter(function(s){ return String(s.studentId||'').indexOf('ADMIN-') !== 0; });
  if (cleaned.length !== all.length){ saveStudents(cleaned); }
  all = cleaned;

  renderTable(all);
  hideResult();

  function uniqueById(arr) {
    var seen = Object.create(null), out = [];
    for (var i = 0; i < arr.length; i++) {
      var s = arr[i];
      if (!s || !s.studentId) continue;
      if (!seen[s.studentId]) { seen[s.studentId] = 1; out.push(s); }
    }
    return out;
  }

  function refreshSuggestions(q) {
    q = (q || '').trim().toLowerCase();
    $datalist.empty();
    if (!q) {
      uniqueById(all).slice(0, 20).forEach(function (s) {
        $datalist.append($('<option>').attr('value', s.studentId));
      });
      return;
    }
    var hits = [];
    for (var i = 0; i < all.length; i++) {
      var s = all[i];
      var sid = String(s.studentId || '').toLowerCase();
      var name = String(s.name || '').toLowerCase();
      var email = String(s.email || '').toLowerCase();
      if (sid.indexOf(q) !== -1 || name.indexOf(q) !== -1 || email.indexOf(q) !== -1) {
        hits.push(s);
      }
      if (hits.length >= 20) break;
    }
    hits = uniqueById(hits);
    hits.forEach(function (s) {
      $datalist.append($('<option>').attr('value', s.studentId));
    });
  }

  // initial suggestions
  refreshSuggestions('');

  $query.on('input', function () {
    refreshSuggestions($(this).val());
  });

  $form.on('submit', function (e) {
    e.preventDefault();
    $form.addClass('was-validated');
    if (!$form[0].checkValidity()) return;

    var q = $.trim($query.val());
    var students = loadStudents();

    var exact = students.find(function (s) { return s.studentId === q; });

    if (exact) {
      showResult(exact);
      renderTable([exact]);
      return;
    }

    var ql = q.toLowerCase();
    var list = students.filter(function (s) {
      return String(s.studentId || '').toLowerCase().indexOf(ql) !== -1 ||
             String(s.name || '').toLowerCase().indexOf(ql) !== -1 ||
             String(s.email || '').toLowerCase().indexOf(ql) !== -1;
    });

    if (list.length === 1) { showResult(list[0]); } else { hideResult(); }
    renderTable(list);
    if (!list.length) alert('No student matched: ' + q);
  });

  $('#resetBtn').on('click', function () {
    $form.removeClass('was-validated')[0].reset();
    hideResult();
    renderTable(all = loadStudents());
    refreshSuggestions('');
    $query.focus();
  });

  // ---- Rendering ----
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
      $('<td>').text(s.semester != null ? s.semester : '').appendTo($tr);
      $('<td>').text(s.courses != null ? s.courses : '').appendTo($tr);

      var loginUser = null; try{ loginUser = JSON.parse(localStorage.getItem('loginUser')||'null'); }catch(e){}
      if (loginUser && loginUser.role === 'admin') {
        var $del = $('<button>')
          .addClass('btn btn-sm btn-danger')
          .text('Delete')
          .on('click', (function (sid) {
            return function () {
              if (confirm('Delete student ' + sid + '?')) deleteStudent(sid);
            };
          })(s.studentId));
        $('<td>').append($del).appendTo($tr);
      } else {
        $('<td>').appendTo($tr);
      }

      $tbody.append($tr);
    }

    if (!list.length) {
      var $tr = $('<tr>');
      $('<td>').attr('colspan', 9).addClass('text-center text-muted py-3').text('No students found').appendTo($tr);
      $tbody.append($tr);
    }
  }

  function deleteStudent(studentId) {
    var students = loadStudents().filter(function(s){ return s.studentId !== studentId; });
    saveStudents(students);

    var users = loadUsers().filter(function(u){ return u.studentId !== studentId; });
    saveUsers(users);

    alert('Student ' + studentId + ' deleted.');
    location.reload();
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

  function hideResult() { $resultWrap.addClass('d-none'); $resultBody.empty(); }

  function item(label, value) {
    value = (value === undefined || value === null || value === '') ? '-' : value;
    return '<div class="col-12"><div class="d-flex"><div class="me-2 fw-semibold">'+
           escapeHtml(label)+':</div><div>'+escapeHtml(String(value))+'</div></div></div>';
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
});
