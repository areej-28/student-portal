function getUsers(){try{return JSON.parse(localStorage.getItem('users'))||[];}catch(e){return[];}}
function saveUsers(a){localStorage.setItem('users',JSON.stringify(a));}
function getStudents(){try{return JSON.parse(localStorage.getItem('students'))||[];}catch(e){return[];}}
function saveStudents(a){localStorage.setItem('students',JSON.stringify(a));}
function generateStudentId(){
  var year=new Date().getFullYear();
  var n=parseInt(localStorage.getItem('sidCounter')||'0',10)+1;
  localStorage.setItem('sidCounter',String(n));
  var seq=('0000'+n).slice(-4);
  return 'SID-'+year+'-'+seq;
}
$(function(){
  $('#signupForm').on('submit',function(e){
    e.preventDefault();
    var name=$('#su_name').val().trim();
    var email=$('#su_email').val().trim();
    var age=parseInt($('#su_age').val(),10);
    var p=$('#su_password').val().trim();
    var c=$('#su_confirm').val().trim();
    if(!name||!email||!age||!p||!c){alert('Please fill all fields');return;}
    if(p.length<8){alert('Password must be at least 8 characters');return;}
    if(p!==c){alert('Passwords do not match');return;}

    var users=getUsers();
    var sid; do{sid=generateStudentId();}while(users.some(function(u){return u.studentId===sid;}));

    users.push({studentId:sid,name:name,email:email,age:age,password:p,role:'student'});
    saveUsers(users);

    var students=getStudents();
    var ix=students.findIndex(function(s){return s.studentId===sid;});
    var profile={studentId:sid,name:name,email:email,age:age,major:'',semester:'',courses:''};
    if(ix>=0)students[ix]=profile; else students.push(profile);
    saveStudents(students);

    $('#showSid').text(sid);
    $('#created').removeClass('d-none');
    localStorage.setItem('flash','Your Student ID is '+sid+'. Use it to log in.');
    $('#su_password,#su_confirm').val('');
  });
});
