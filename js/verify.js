var params = new URLSearchParams(window.location.search);
var token = params.get('token');

if (!token) {
    document.getElementById('verifyTitle').textContent = 'Error';
    document.getElementById('verifyMsg').textContent = 'No verification token found.';
} else {
    fetch('https://britkor1.pythonanywhere.com/verify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({token: token})
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.status === 'passed') {
            localStorage.setItem('britkor', JSON.stringify({
                session: result.session,
                username: result.username
            }));
            document.getElementById('verifyTitle').textContent = 'Email Verified!';
            document.getElementById('verifyMsg').innerHTML = 'Welcome <span class="at">@</span><span class="name">' + result.username + '</span>. Your account is now active.';
            setTimeout(function() {
                window.location.href = 'home.html';
            }, 5000);
        } else {
            document.getElementById('verifyTitle').textContent = 'Error';
            document.getElementById('verifyMsg').textContent = 'Invalid or expired link.';
        }
    });
}