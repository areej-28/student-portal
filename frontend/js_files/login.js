$(function () {
  var randomUsername = "user" + Math.floor(Math.random() * 1000);
  var randomPassword = Math.random().toString(36).substring(2, 8);

  // show the username and password so you know what to type
  console.log("Username: " + randomUsername + " | Password: " + randomPassword);
  alert("Use Username: " + randomUsername + " and Password: " + randomPassword);

  $('#loginForm').on('submit', function (e) {
    e.preventDefault(); 
    var u = $('#username').val().trim();
    var p = $('#password').val().trim();

    if (!u || !p) {
      alert('Please fill both fields');
      return;
    }

    if (u === randomUsername && p === randomPassword) {
      localStorage.setItem('isLoggedIn', 'yes');
      localStorage.setItem('loginUser', u);
      window.location.href = 'form.html'; 
    } else {
      alert('Invalid username or password');
    }
  });
});
