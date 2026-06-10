var icons = { cleaning: '🧹', moving: '📦', repair: '🔧', delivery: '🚗', general: '🛠️' };
var genders = { female: '👩 Female only', male: '👨 Male only', any: '👥 Anyone' };

var params = new URLSearchParams(window.location.search);
var taskId = params.get('id');

if (taskId) {
    var britkor = JSON.parse(localStorage.getItem('britkor') || '{}');
    var tasks = britkor.tasks || [];
    var task = null;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            task = tasks[i];
            break;
        }
    }
    if (task) {
        document.getElementById('detailIcon').textContent = icons[task.category] || '📝';
        document.getElementById('detailTitle').textContent = task.title;
        document.getElementById('detailUsername').textContent = task.username;
        document.getElementById('detailDate').textContent = task.created_at.slice(0, 10);
        document.getElementById('detailGender').textContent = genders[task.preferred_gender] || '👥 Anyone';
        document.getElementById('detailLocation').textContent = '📍 ' + (task.location.address || task.location.city || 'Casablanca');
        document.getElementById('detailBudget').textContent = task.budget + ' MAD';
        document.getElementById('detailDescription').textContent = task.details || 'No description';

        if (task.photos && task.photos.length > 0) {
            var photosHtml = '';
            for (var j = 0; j < task.photos.length; j++) {
                photosHtml += '<img src="' + task.photos[j] + '" style="width:80px;height:80px;border-radius:8px;object-fit:cover;">';
            }
            document.getElementById('detailPhotos').innerHTML = photosHtml;
        } else {
            document.getElementById('detailPhotos').style.display = 'none';
        }

        if (task.location && task.location.lat) {
            var map = L.map('detailMap', { zoomControl: false, attributionControl: false }).setView([task.location.lat, task.location.lng], 15);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
            L.marker([task.location.lat, task.location.lng], {
                icon: L.divIcon({
                    className: '',
                    html: '<div style="width:28px;height:28px;background:#7c3aed;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(124,58,237,0.3);"></div>',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                })
            }).addTo(map);
            document.getElementById('mapLink').href = 'https://www.google.com/maps?q=' + task.location.lat + ',' + task.location.lng;
        } else {
            document.getElementById('detailMap').style.display = 'none';
            document.getElementById('mapLink').style.display = 'none';
        }
    }
}