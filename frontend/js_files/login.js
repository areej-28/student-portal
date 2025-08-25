function getUsers(){try{return JSON.parse(localStorage.getItem('users'))||[];}catch(e){return[];}}

$(function(){
  var flash=localStorage.getItem('flash');
  if(flash){$('#flash').removeClass('d-none').text(flash);localStorage.removeItem('flash')}
  else{$('#flash').addClass('d-none').text('')}

  $('#loginForm').on('submit',function(e){
    e.preventDefault();
    var sid=$('#sid').val().trim();
    var pw=$('#password').val().trim();
    if(!sid||!pw){alert('Please fill both fields');return;}

    var users=getUsers(); if(!users.length){alert('No accounts found. Please sign up first.');return;}
    var user=users.find(function(u){return u.studentId===sid && u.password===pw;});
    if(!user){alert('Student ID or password is wrong');return;}

    localStorage.setItem('isLoggedIn','yes');
    localStorage.setItem('loginUser',JSON.stringify(user));
    window.location.href='../html_files/student.html';
  });
});
