function updatePhotoLabel() {
    var input = document.querySelector('.photo-upload input');
    var label = document.getElementById('photoLabel');
    var text = document.getElementById('photoText');
    if (input.files.length > 0) {
        var names = [];
        for (var i = 0; i < input.files.length; i++) {
            names.push(input.files[i].name);
        }
        text.textContent = names.join(', ');
        label.classList.add('has-file');
    } else {
        text.textContent = 'Add photos';
        label.classList.remove('has-file');
    }
}

var map = L.map('createMap', { zoomControl: false, attributionControl: false }).setView([33.5731, -7.5898], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);

var marker;

map.on('click', function(e) {
    setMarker(e.latlng.lat, e.latlng.lng);
});

function useMyLocation() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        setMarker(pos.coords.latitude, pos.coords.longitude);
        map.setView([pos.coords.latitude, pos.coords.longitude], 16);
    });
}

function setMarker(lat, lng) {
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: '',
            html: '<div style="width:24px;height:24px;background:#7c3aed;border:3px solid #fff;border-radius:50%;"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    }).addTo(map);
    document.getElementById('taskLat').value = lat;
    document.getElementById('taskLng').value = lng;
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    var files = document.querySelector('.photo-upload input').files;
    var data = {
        session: JSON.parse(localStorage.getItem('britkor') || '{}').session || '',
        title: this.querySelector('[name="title"]').value,
        category: this.querySelector('[name="category"]').value,
        budget: this.querySelector('[name="budget"]').value,
        preferred_gender: this.querySelector('[name="gender"]').value,
        details: this.querySelector('[name="details"]').value,
        lat: document.getElementById('taskLat').value || 33.5731,
        lng: document.getElementById('taskLng').value || -7.5898
    };
    if (files.length === 0) {
        sendTask(data);
        return;
    }
    var photos = [];
    var done = 0;
    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = function(e) {
            photos.push(e.target.result);
            done++;
            if (done === files.length) {
                data.photos = photos;
                sendTask(data);
            }
        };
        reader.readAsDataURL(files[i]);
    }
});

function sendTask(data) {
    fetch('https://britkor1.pythonanywhere.com/create-task', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
        if (result.status === 'passed') {
            window.location.href = 'tasks.html';
        }
    });
}