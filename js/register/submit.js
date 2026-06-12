function submit(data, callback) {
    fetch('config/api.json')
        .then(function(res) { return res.json(); })
        .then(function(config) {
            fetch(config.api + '/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(function(res) { return res.json(); })
            .then(callback);
        });
}