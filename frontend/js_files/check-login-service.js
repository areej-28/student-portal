
//function isUserLoggedIn(){ try{return (Boolean)(localStorage.getItem('isLoggedIn'))||false;}catch(e){return false;} }


//$(function(){

  //var isLoggedIn = isUserLoggedIn();
  
 // if(!isLoggedIn){
   // $('.login-nav').show();
   // $('.my-profile-nav').hide();
//  } else{
   // $('.login-nav').hide();
   // $('.my-profile-nav').show();
  //}

//});

// /js_files/check-login-service.js

function isUserLoggedIn() {
  try { return (localStorage.getItem('isLoggedIn') === 'yes'); }
  catch (e) { return false; }
}
function getLoginUser() {
  try { return JSON.parse(localStorage.getItem('loginUser') || 'null'); }
  catch (e) { return null; }
}
function currentRole() {
  var u = getLoginUser();
  return u && u.role ? u.role : null; 
}

function isUserLoggedIn(){ try{return localStorage.getItem('isLoggedIn')==='yes';}catch(e){return false;} }
function getLoginUser(){ try{return JSON.parse(localStorage.getItem('loginUser')||'null');}catch(e){return null;} }
function currentRole(){ var u=getLoginUser(); return u&&u.role ? u.role : null; }

$(function(){
  var logged=isUserLoggedIn();
  var role=currentRole();

  $('.login-nav').toggle(!logged);
  $('.my-profile-nav').toggle(!!logged);

  $('.guest-only').toggle(!logged);
  $('.auth-only').toggle(!!logged);
  $('.admin-only').toggle(logged && role==='admin');
  $('.student-only').toggle(logged && (role==='student' || role==='admin')); // admin can see student stuff too
});

