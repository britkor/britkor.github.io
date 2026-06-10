var britkor = JSON.parse(localStorage.getItem('britkor') || '{}');

if (!britkor.session) {
    window.location.href = 'index.html';
}

var icons = {
    cleaning: '🧹',
    moving: '📦',
    repair: '🔧',
    delivery: '🚗',
    general: '🛠️'
};

function renderTasks(tasks) {
    var html = '';
    for (var i = 0; i < tasks.length; i++) {
        var t = tasks[i];
        html += '<a href="detail.html?id=' + t.id + '" class="card-link">';
        html += '<div class="card task-card">';
        html += '<span class="card-icon">' + (icons[t.category] || '📝') + '</span>';
        html += '<div class="card-info">';
        html += '<h3>' + t.title + '</h3>';
        html += '<p>' + (t.location.city || 'Casablanca') + ' · ' + t.created_at.slice(0, 10) + '</p>';
        html += '</div>';
        html += '<span class="task-price">' + t.budget + ' MAD</span>';
        html += '</div>';
        html += '</a>';
    }
    document.querySelector('.content').innerHTML = 
        '<div class="tasks-header"><h2>Available Tasks</h2>' +
        '<div class="view-switch">' +
        '<a href="tasks.html" class="switch-btn active"><img src="assets/list.svg" width="14" height="14" alt="List" style="vertical-align:-2px;margin-right:4px;"> List</a>' +
        '<a href="tasks-map.html" class="switch-btn"><img src="assets/map.svg" width="14" height="14" alt="Map" style="vertical-align:-2px;margin-right:4px;"> Map</a>' +
        '</div></div>' +
        '<button onclick="refreshTasks()" class="refresh-btn">🔄 Refresh</button>' + html;
}

function refreshTasks() {
    var britkor = JSON.parse(localStorage.getItem('britkor') || '{}');
    delete britkor.tasks;
    localStorage.setItem('britkor', JSON.stringify(britkor));
    location.reload();
}

if (britkor.tasks) {
    renderTasks(britkor.tasks);
} else {
    fetch('https://britkor1.pythonanywhere.com/tasks', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session: britkor.session})
    })
    .then(function(res) { return res.json(); })
    .then(function(tasks) {
        britkor.tasks = tasks;
        localStorage.setItem('britkor', JSON.stringify(britkor));
        renderTasks(tasks);
    });
}