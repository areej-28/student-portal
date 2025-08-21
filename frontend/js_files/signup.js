$(function () {
    $('#signupForm').on('submit', function (e) {
        e.preventDefault();

        var u = $('#su_username').val().trim();
        var p = $('#su_password').val().trim();
        var c = $('#su_confirm').val().trim();

        if (!u || !p || !c) { alert('Please fill all fields'); return; }
        if (p.length < 6) { alert('Password must be at least 6 characters'); return; }
        if (p !== c) { alert('Passwords do not match'); return; }

        // store one account only
        var existing = localStorage.getItem('authUser');
        if (existing) {
            try {
                var obj = JSON.parse(existing);
                if (obj && obj.username === u) {
                    alert('This username already exists. Choose another one.');
                    return;
                }
            } catch (e) { }
        }

        localStorage.setItem('authUser', JSON.stringify({ username: u, password: p }));
        localStorage.setItem('flash', 'Account created. Please log in.');
        window.location.href = '../html_files/login.html';
    });
});