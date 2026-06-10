var britkor = JSON.parse(localStorage.getItem('britkor') || '{}');

var map = L.map('tasksMap', { 
    zoomControl: false,
    attributionControl: false 
}).setView([33.5731, -7.5898], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

var cluster = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 50,
    iconCreateFunction: function(cluster) {
        var count = cluster.getChildCount();
        return L.divIcon({
            html: '<div style="width:44px;height:44px;background:#7c3aed;border:3px solid #fff;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:600;box-shadow:0 2px 8px rgba(124,58,237,0.3);line-height:44px;text-align:center;">' + count + '</div>',
            className: '',
            iconSize: [44, 44]
        });
    }
});

var icons = { cleaning: '🧹', moving: '📦', repair: '🔧', delivery: '🚗', general: '🛠️' };

if (britkor.tasks) {
    loadMarkers(britkor.tasks);
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
        loadMarkers(tasks);
    });
}

function loadMarkers(tasks) {
    tasks.forEach(function(t) {
        if (t.location && t.location.lat) {
            var marker = L.marker([t.location.lat, t.location.lng], {
                icon: L.divIcon({
                    className: '',
                    html: '<div style="width:36px;height:36px;background:#7c3aed;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(124,58,237,0.3);color:#fff;">' + (icons[t.category] || '📝') + '</div>',
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                })
            });

            marker.on('click', function() {
                document.getElementById('previewIcon').textContent = icons[t.category] || '📝';
                document.getElementById('previewTitle').textContent = t.title;
                document.getElementById('previewDist').textContent = '📍 ' + (t.location.city || 'Casablanca');
                document.getElementById('previewPrice').textContent = t.budget + ' MAD';
                document.getElementById('previewLink').href = 'detail.html?id=' + t.id;
                document.getElementById('taskPreview').classList.add('show');
                map.setView([t.location.lat - 0.003, t.location.lng], 14);
            });

            cluster.addLayer(marker);
        }
    });

    map.addLayer(cluster);

    map.on('click', function() {
        document.getElementById('taskPreview').classList.remove('show');
    });
}