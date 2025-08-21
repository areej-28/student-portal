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

    var saved = localStorage.getItem('authUser');
    if (!saved) {
      alert('No account found. Please sign up first.');
      return;
    }

    var acc = null;
    try { acc = JSON.parse(saved); } catch (err) {}

    if (acc && acc.username === u && acc.password === p) {
      localStorage.setItem('isLoggedIn', 'yes');
      localStorage.setItem('loginUser', u);
      window.location.href = 'form.html';
    } else {
      alert('Invalid username or password');
    }
  });
});
