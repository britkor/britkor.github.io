var britkor = JSON.parse(localStorage.getItem('britkor') || '{}');

if (!britkor.session) {
    window.location.href = 'index.html';
}

if (britkor.username) {
    document.querySelector('.welcome .name').textContent = britkor.username;
}