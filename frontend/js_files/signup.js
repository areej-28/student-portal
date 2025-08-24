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

$(function () {
  $('#signupForm').on('submit', function (e) {
    e.preventDefault();

    var u = $('#su_username').val().trim();
    var p = $('#su_password').val().trim();
    var c = $('#su_confirm').val().trim();

    if (!u || !p || !c) { alert('Please fill all fields'); return; }
    if (p.length < 8) { alert('Password must be at least 8 characters'); return; }
    if (p !== c) { alert('Passwords do not match'); return; }

    var users = getUsers();
    if (findUser(u)) {
      alert('This username already exists. Choose another one.');
      return;
    }

    users.push({ username: u, password: p });
    saveUsers(users);

    localStorage.setItem('flash', 'Account created. Please log in.');
    window.location.href = '../html_files/login.html';
  });
});
