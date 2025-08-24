function getUsers() {
  var raw = localStorage.getItem('users');
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
function saveUsers(arr) {
  localStorage.setItem('users', JSON.stringify(arr));
}
function findUser(username) {
  var list = getUsers();
  for (var i = 0; i < list.length; i++) {
    if (list[i].username === username) return list[i];
  }
  return null;
}

(function migrateSingleAccount() {
  var old = localStorage.getItem('authUser');
  if (!old) return;
  try {
    var one = JSON.parse(old); 
    if (one && one.username) {
      var users = getUsers();
      if (!findUser(one.username)) {
        users.push({ username: one.username, password: one.password });
        saveUsers(users);
      }
    }
  } catch (e) { /* ignore */ }
  localStorage.removeItem('authUser');
})();

$(function () {
  var msg = localStorage.getItem('flash');
  if (msg) {
    $('#flash').text(msg).removeClass('d-none');
    localStorage.removeItem('flash');
  }

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    var u = $('#username').val().trim();
    var p = $('#password').val().trim();

    if (!u || !p) {
      alert('Please fill both fields');
      return;
    }

    var users = getUsers();
    if (!users.length) {
      alert('No accounts found. Please sign up first.');
      return;
    }

    var ok = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === u && users[i].password === p) {
        ok = true;
        break;
      }
    }

    if (ok) {
      localStorage.setItem('isLoggedIn', 'yes');
      localStorage.setItem('loginUser', u);
      window.location.href = 'form.html';
    } else {
      alert('Invalid username or password');
    }
  });
});
