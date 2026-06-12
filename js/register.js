document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    var data = {
        username: this.querySelector('[name="username"]').value,
        email: this.querySelector('[name="email"]').value,
        password: this.querySelector('[name="password"]').value
    };
    
    var check = validate(data);
    if (!check.valid) {
        document.getElementById('message').textContent = check.message;
        return;
    }
    
    submit(data, function(result) {
        if (result.status === 'passed') {
            document.getElementById('message').textContent = result.message;
        }
    });
});