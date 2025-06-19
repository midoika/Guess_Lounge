let meshVisible = false;
let meshLines = [];
let meshLabels = [];

// 旧日本測地系から世界測地系 (Tokyo Datum to WGS84) に変換する関数
// https://haiden.sakura.ne.jp/sp/geodetic-conv.php
function toTokyoDatum(jlat, jlng) {
    const Lat = jlat - 0.00010695 * jlat + 0.000017464 * jlng + 0.0046017;
    const Lng = jlng - 0.000046038 * jlat - 0.000083043 * jlng + 0.010040;
    return { lat: Lat, lng: Lng };
}

// メッシュ表示の切り替え
document.getElementById('toggleMeshButton').addEventListener('click', () => {
    meshVisible = !meshVisible;

    if (meshVisible) {
        drawHokkaidoMesh();
        document.getElementById('toggleMeshButton').textContent = 'hidden Hokkaido Mesh';
    } else {
        clearHokkaidoMesh();
        document.getElementById('toggleMeshButton').textContent = 'Show Hokkaido Mesh';
    }
});

function drawHokkaidoMesh() {
    const startLat = 41 + 1 / 3;
    const endLat = 45.7;
    const startLng = 139.0;
    const endLng = 146.0;

    const latStep = 2 / 3; // 約40分（0.6667度）
    const lngStep = 1;     // 1度

    let row = 0;
    for (let lat = startLat; lat < endLat; lat += latStep, row++) {
        let col = 0;
        for (let lng = startLng; lng < endLng; lng += lngStep, col++) {
            const sw = toTokyoDatum(lat, lng);
            const ne = toTokyoDatum(lat + latStep, lng + lngStep);

            const bounds = [
                [{ lat: sw.lat, lng: sw.lng }, { lat: sw.lat, lng: ne.lng }],
                [{ lat: sw.lat, lng: ne.lng }, { lat: ne.lat, lng: ne.lng }],
                [{ lat: ne.lat, lng: ne.lng }, { lat: ne.lat, lng: sw.lng }],
                [{ lat: ne.lat, lng: sw.lng }, { lat: sw.lat, lng: sw.lng }],
            ];

            bounds.forEach(([from, to]) => {
                const line = new google.maps.Polyline({
                    path: [from, to],
                    strokeColor: '#0000FF',
                    strokeOpacity: 0.3,
                    strokeWeight: 1,
                    map: map
                });
                meshLines.push(line);
            });

            // 函館は30、札幌は41
            const meshNumber = (20 + row * 10 + (col + 9) % 10).toString();

            const label = new google.maps.Marker({
                position: { lat: (sw.lat + ne.lat) / 2, lng: (sw.lng + ne.lng) / 2 },
                label: meshNumber,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 0,
                },
                map: map
            });
            meshLabels.push(label);
        }
    }
}

function clearHokkaidoMesh() {
    meshLines.forEach(line => line.setMap(null));
    meshLines = [];

    meshLabels.forEach(label => label.setMap(null));
    meshLabels = [];
}
