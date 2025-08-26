$(function(){
  function adjust(){
    var nh=$('.navbar.fixed-top').outerHeight()||0;
    var fh=$('footer.fixed-bottom').outerHeight()||0;
    $('body').css('padding-top',nh+'px').css('padding-bottom',fh+'px');
  }
  adjust(); $(window).on('resize',adjust);
});

function _getUsers(){ try { return JSON.parse(localStorage.getItem('users')) || []; } catch(e){ return []; } }
function _saveUsers(arr){ localStorage.setItem('users', JSON.stringify(arr || [])); }

function _isLoggedIn(){ return localStorage.getItem('isLoggedIn') === 'yes'; }
function _getLoginUser(){ try{ return JSON.parse(localStorage.getItem('loginUser')||'null'); }catch(e){ return null; } }
function _currentRole(){ var u=_getLoginUser(); return (u && u.role) ? u.role : null; } // 'admin' | 'student' | null

(function seedAdminOnce(){
  var users = _getUsers();
  var hasAdmin = users.some(function(u){ return u && u.role === 'admin'; });
  if (!users.length || !hasAdmin) {
    var exists = users.some(function(u){ return u && u.studentId === 'ADMIN-0001'; });
    if (!exists) {
      users.push({
        studentId: 'ADMIN-0001',
        name: 'Site Admin',
        email: 'admin@example.com',
        age: '',
        password: 'admin123',
        role: 'admin'
      });
      _saveUsers(users);
      console.log('Seeded admin → ID: ADMIN-0001 / Pass: admin123');
    }
  }
})();

function requireRole(who, redirectIfNotAuthed){
  var logged = _isLoggedIn();
  var role = _currentRole();

  if (!logged){
    window.location.href = redirectIfNotAuthed || '../html_files/login.html';
    return false;
  }
  if (who === 'any') return true;
  if (who === 'admin' && role === 'admin') return true;
  if (who === 'student' && (role === 'student' || role === 'admin')) return true;

  // Not enough permission
  window.location.href = '../html_files/home.html';
  return false;
}

$(document).on('click', '.logout-link', function(e){
  e.preventDefault();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginUser');
  window.location.href = '../html_files/login.html';
});
(function(){
  var users; try{ users=JSON.parse(localStorage.getItem('users'))||[]; }catch(e){ users=[]; }
  var hasAdmin = users.some(function(u){ return u && u.role==='admin'; });
  if(!hasAdmin){
    var exists = users.some(function(u){ return u && u.studentId==='ADMIN-0001'; });
    if(!exists){
      users.push({
        studentId:'ADMIN-0001',
        name:'Site Admin',
        email:'admin@example.com',
        age:'',
        password:'admin123',
        role:'admin'
      });
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Seeded admin → ADMIN-0001 / admin123');
    }
  }
})();
