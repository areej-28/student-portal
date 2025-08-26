function getUsers(){try{return JSON.parse(localStorage.getItem('users'))||[];}catch(e){return[];}}
function saveUsers(a){localStorage.setItem('users',JSON.stringify(a||[]));}

$(function(){
  var flash=localStorage.getItem('flash');
  if(flash){$('#flash').removeClass('d-none').text(flash);localStorage.removeItem('flash')}
  else{$('#flash').addClass('d-none').text('')}

  $('#loginForm').on('submit',function(e){
    e.preventDefault();

    var sid=$('#sid').val().trim();
    var pw=$('#password').val().trim();
    var selectedRole=$('input[name="role"]:checked').val() || null; 
    if(!sid||!pw){alert('Please fill both fields');return;}

    var users=getUsers(); 
    if(!users.length){alert('No accounts found. Please sign up first.');return;}

    var user=users.find(function(u){return u.studentId===sid && u.password===pw;});
    if(!user){alert('Student ID or password is wrong');return;}

    if(!user.role){
      user.role = selectedRole || ((String(user.studentId).indexOf('ADMIN-')===0) ? 'admin' : 'student');
      for(var i=0;i<users.length;i++){ if(users[i].studentId===user.studentId){ users[i]=user; break; } }
      saveUsers(users);
    }

    if(selectedRole && user.role !== selectedRole){
      alert('This account is '+user.role+'. Switch the selector to "'+user.role+'" or use an account with the "'+selectedRole+'" role.');
      return;
    }

    localStorage.setItem('isLoggedIn','yes');
    localStorage.setItem('loginUser',JSON.stringify(user));

    // Redirect by role
    if(user.role==='admin'){
      window.location.href='../html_files/search.html';   
    }else{
      window.location.href='../html_files/student.html';  
    }
  });
});
