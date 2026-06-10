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

var tasks = [
    { icon: '🧹', title: 'Clean my apartment', lat: 33.5731, lng: -7.5898, price: '150 MAD', dist: '0.5 km' },
    { icon: '📦', title: 'Move furniture', lat: 33.5800, lng: -7.6000, price: '300 MAD', dist: '1.2 km' },
    { icon: '🔧', title: 'Fix kitchen pipe', lat: 33.5650, lng: -7.5950, price: '200 MAD', dist: '0.8 km' }
];

tasks.forEach(function(t) {
    var marker = L.marker([t.lat, t.lng], {
        icon: L.divIcon({
            className: '',
            html: '<div style="width:36px;height:36px;background:#7c3aed;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(124,58,237,0.3);color:#fff;">' + t.icon + '</div>',
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        })
    });

    marker.on('click', function() {
        document.getElementById('previewIcon').textContent = t.icon;
        document.getElementById('previewTitle').textContent = t.title;
        document.getElementById('previewDist').textContent = '📍 ' + t.dist;
        document.getElementById('previewPrice').textContent = t.price;
        document.getElementById('taskPreview').style.display = 'block';
        map.setView([t.lat - 0.003, t.lng], 14);
    });

    cluster.addLayer(marker);
});

map.addLayer(cluster);

map.on('click', function() {
    document.getElementById('taskPreview').style.display = 'none';
});