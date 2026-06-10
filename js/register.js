var britkor = JSON.parse(localStorage.getItem('britkor') || '{}');

if (britkor.success && Date.now() < britkor.expires) {
    document.getElementById('formWrap').style.display = 'none';
    document.getElementById('successWrap').style.display = 'block';
    document.getElementById('successWrap').style.opacity = '1';
    document.getElementById('successEmail').textContent = britkor.email;
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (britkor.success && Date.now() < britkor.expires) {
        document.getElementById('formWrap').style.display = 'none';
        document.getElementById('successWrap').style.display = 'block';
        document.getElementById('successWrap').style.opacity = '1';
        document.getElementById('successEmail').textContent = britkor.email;
        return;
    }
    var emailValue = this.querySelector('[name="email"]').value;
    var data = {
        username: this.querySelector('[name="username"]').value,
        email: emailValue,
        password: this.querySelector('[name="password"]').value
    };
    fetch('https://britkor1.pythonanywhere.com/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.status === 'passed') {
            localStorage.setItem('britkor', JSON.stringify({
                success: true,
                email: emailValue,
                expires: Date.now() + 60000
            }));
            var formWrap = document.getElementById('formWrap');
            var successWrap = document.getElementById('successWrap');
            formWrap.style.opacity = '0';
            setTimeout(function() {
                formWrap.style.display = 'none';
                successWrap.style.display = 'block';
                successWrap.style.opacity = '0';
                setTimeout(function() {
                    successWrap.style.opacity = '1';
                }, 50);
                document.getElementById('successEmail').textContent = emailValue;
            }, 400);
        } else {
            document.getElementById('message').textContent = 'Registration failed.';
        }
    });
});