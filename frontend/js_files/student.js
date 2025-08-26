var STUDENTS_KEY='students';

function getUsers(){ try{return JSON.parse(localStorage.getItem('users'))||[];}catch(e){return[];} }
function saveUsers(a){ localStorage.setItem('users', JSON.stringify(a)); }

function loadStudents(){ try{return JSON.parse(localStorage.getItem(STUDENTS_KEY))||[];}catch(e){return[];} }
function saveStudents(a){ localStorage.setItem(STUDENTS_KEY, JSON.stringify(a)); }

$(function(){
  if(localStorage.getItem('isLoggedIn')!=='yes'){ window.location.href='./html_files/login.html'; return; }
  var user=null; try{ user=JSON.parse(localStorage.getItem('loginUser')); }catch(e){}
  if(!user || !user.studentId){ window.location.href='./html_files/login.html'; return; }

  var sid=user.studentId;
  var role = user.role || ((String(sid).indexOf('ADMIN-')===0) ? 'admin' : 'student');

  $('#sidDisplay').text(sid);
  $('#studentId').val(sid);

  var students=loadStudents();

  if (role === 'admin') {
    var info = {
      studentId: sid,
      name: user.name || '',
      email: user.email || '',
      age: user.age || '',
      major: '',
      semester: '',
      courses: ''
    };
    renderMine(info);
    $('#studentForm :input').prop('disabled', true);
    $('#saved').addClass('d-none');
    return; 
  }

  var mine=students.find(function(s){ return s.studentId===sid; });
  if(!mine){
    mine={ studentId:sid, name:user.name||'', email:user.email||'', age:user.age||'',
           major:'', semester:'', courses:'' };
    students.push(mine); saveStudents(students);
  }

  $('#name').val(mine.name||'');
  $('#email').val(mine.email||'');
  $('#age').val(mine.age||'');
  $('#major').val(mine.major||'');
  $('#semester').val(mine.semester||'');
  $('#courses').val(mine.courses||'');
  renderMine(mine);

  $('#studentForm').on('submit', function(e){
    e.preventDefault();
    var rec={
      studentId: sid,
      name: $.trim($('#name').val()),
      email: $.trim($('#email').val()),
      age: parseInt($('#age').val(),10) || '',
      major: $.trim($('#major').val()),
      semester: parseInt($('#semester').val(),10) || '',
      courses: parseInt($('#courses').val(),10) || ''
    };

    var ix = students.findIndex(function(s){ return s.studentId===sid; });
    if(ix>=0) students[ix]=rec; else students.push(rec);
    saveStudents(students);

    var users=getUsers();
    var ux=users.findIndex(function(u){ return u.studentId===sid; });
    if(ux>=0){ users[ux].name=rec.name; users[ux].email=rec.email; users[ux].age=rec.age; saveUsers(users); }

    $('#saved').removeClass('d-none'); setTimeout(function(){ $('#saved').addClass('d-none'); }, 1200);
    renderMine(rec);
  });

  $('#logout').on('click', function(e){
    e.preventDefault();
    localStorage.removeItem('isLoggedIn'); localStorage.removeItem('loginUser');
    window.location.href='./html_files/login.html';
  });

  function renderMine(r){
    $('#mine').html(
      '<div><strong>Student ID:</strong> '+(r.studentId||'-')+'</div>'+
      '<div><strong>Name:</strong> '+(r.name||'-')+'</div>'+
      '<div><strong>Email:</strong> '+(r.email||'-')+'</div>'+
      '<div><strong>Age:</strong> '+(r.age||'-')+'</div>'+
      '<div><strong>Major:</strong> '+(r.major||'-')+'</div>'+
      '<div><strong>Current Semester:</strong> '+(r.semester||'-')+'</div>'+
      '<div><strong>Courses this semester:</strong> '+(r.courses||'-')+'</div>'
    );
  }
});
