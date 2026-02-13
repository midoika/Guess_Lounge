let meshVisible = false;
let meshLines = [];
let meshLabels = [];

// 旧日本測地系(?) -> WGS84 近似変換
function toTokyoDatum(jlat, jlng) {
  const Lat = jlat - 0.00010695 * jlat + 0.000017464 * jlng + 0.0046017;
  const Lng = jlng - 0.000046038 * jlat - 0.000083043 * jlng + 0.010040;
  return { lat: Lat, lng: Lng };
}

document.getElementById('toggleMeshButton').addEventListener('click', () => {
  meshVisible = !meshVisible;

  if (meshVisible) {
    drawHokkaidoMeshLight();
    document.getElementById('toggleMeshButton').textContent = 'Hide Hokkaido Mesh';
  } else {
    clearHokkaidoMesh();
    document.getElementById('toggleMeshButton').textContent = 'Show Hokkaido Mesh';
  }
});

function drawHokkaidoMeshLight() {
  const startLat = 41 + 1 / 3; // 41.333...
  const endLat   = 45.7;
  const startLng = 139.0;
  const endLng   = 146.0;

  const latStep = 2 / 3; // 0.666...
  const lngStep = 1;

  // 除外メッシュ（描かないセル）
  const excluded = new Set(['22','24','25','34','35','59','69','60','79','70','73','74','75','89','83','84','85']);

  // 行数・列数（境界線の本数は +1 になる）
  const nRows = Math.ceil((endLat - startLat) / latStep);
  const nCols = Math.ceil((endLng - startLng) / lngStep);

  // セルが有効かどうか（除外でないか）
  function meshStrOf(row, col) {
    const meshNumber = 20 + row * 10 + (col + 9) % 10;
    return meshNumber.toString();
  }
  function isCellValid(row, col) {
    if (row < 0 || row >= nRows || col < 0 || col >= nCols) return false;
    return !excluded.has(meshStrOf(row, col));
  }

  // 変換済み格子点をキャッシュ（交点を毎回計算しない）
  // p[r][c] = toTokyoDatum(lat_r, lng_c)
  const p = new Array(nRows + 1);
  for (let r = 0; r <= nRows; r++) {
    p[r] = new Array(nCols + 1);
    const lat = startLat + r * latStep;
    for (let c = 0; c <= nCols; c++) {
      const lng = startLng + c * lngStep;
      p[r][c] = toTokyoDatum(lat, lng);
    }
  }

  // 1本のPolylineを作る（複数点をまとめて1本にできる）
  function addPolyline(path) {
    if (!path || path.length < 2) return;
    const line = new google.maps.Polyline({
      path,
      strokeColor: '#0000FF',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      map: map
    });
    meshLines.push(line);
  }

  // 連続区間を走査して polyline 化するヘルパ
  // pred(i) が true の間つなげる。points(i) が i番目境界点を返す。
  function buildSegments(count, pred, pointAt) {
    let runStart = -1;

    for (let i = 0; i < count; i++) {
      if (pred(i)) {
        if (runStart < 0) runStart = i;
      } else {
        if (runStart >= 0) {
          // [runStart, i] の境界点をつなぐ（点は i まで必要）
          const path = [];
          for (let k = runStart; k <= i; k++) path.push(pointAt(k));
          addPolyline(path);
          runStart = -1;
        }
      }
    }
    // 末尾が連続していた場合
    if (runStart >= 0) {
      const path = [];
      for (let k = runStart; k <= count; k++) path.push(pointAt(k));
      addPolyline(path);
    }
  }

  // --------------------------
  // 縦線：列境界 c（0..nCols）ごとに、行方向に連続区間を描く
  // 縦境界線が必要なのは、その境界の左右どちらかに「有効セル」があるとき
  // （= 左セル valid または 右セル valid）
  // --------------------------
  for (let c = 0; c <= nCols; c++) {
    // 行方向に nRows 個の「セル列」を判定して区間化
    buildSegments(
      nRows,
      (r) => isCellValid(r, c - 1) || isCellValid(r, c),
      (k) => ({ lat: p[k][c].lat, lng: p[k][c].lng })
    );
  }

  // --------------------------
  // 横線：行境界 r（0..nRows）ごとに、列方向に連続区間を描く
  // 横境界線が必要なのは、その境界の上下どちらかに「有効セル」があるとき
  // （= 上セル valid または 下セル valid）
  // --------------------------
  for (let r = 0; r <= nRows; r++) {
    buildSegments(
      nCols,
      (c) => isCellValid(r - 1, c) || isCellValid(r, c),
      (k) => ({ lat: p[r][k].lat, lng: p[r][k].lng })
    );
  }

  // --------------------------
  // ラベル（有効セルだけ中央に置く）
  // 交点キャッシュ p を使って中心を計算
  // --------------------------
  for (let row = 0; row < nRows; row++) {
    for (let col = 0; col < nCols; col++) {
      const meshStr = meshStrOf(row, col);
      if (excluded.has(meshStr)) continue;

      // SW = p[row][col], NE = p[row+1][col+1]
      const sw = p[row][col];
      const ne = p[row + 1][col + 1];

      const label = new google.maps.Marker({
        position: { lat: (sw.lat + ne.lat) / 2, lng: (sw.lng + ne.lng) / 2 },
        label: meshStr,
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 0 },
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
