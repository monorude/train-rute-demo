let stations = [];

// JSONデータを読み込む
fetch("stations.json")
  .then(res => res.json())
  .then(data => { stations = data; });

// JSON読み込み後に候補を追加
fetch("stations.json")
  .then(res => res.json())
  .then(data => {
    stations = data;
    const list = document.getElementById("stationsList");
    stations.forEach(st => {
      const option = document.createElement("option");
      option.value = st.name; // 駅名を候補に
      list.appendChild(option);
    });
  });


function sanitizeInput(input) {
  // 記号を禁止
  if (/[\.\(\)]/.test(input)) return null;
  // 駅名リストに存在するか確認
  return stations.find(s => s.name === input) ? input : null;
}

function formatResult(path) {
  if (path.error) return path.error;

  const names = path.path.map(id => {
    const st = stations.find(s => s.id === id);
    return st ? st.name : id;
  });

  return `所要時間: ${path.distance}分\n経路: ${names.join(" → ")}`;
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const startName = sanitizeInput(document.getElementById("start").value);
  const goalName = sanitizeInput(document.getElementById("goal").value);

  if (!startName || !goalName) {
    document.getElementById("result").textContent = "入力が不正です";
    return;
  }

  const path = searchRoute(startName, goalName);
  document.getElementById("result").textContent = formatResult(path);
});


// Dijkstra法（最短時間を探索）
function searchRoute(startName, goalName) {
  // 駅名から駅オブジェクトを探す
  const start = stations.find(s => s.name === startName);
  const goal = stations.find(s => s.name === goalName);
  if (!start || !goal) return { error: "駅が見つかりません" };

  // 優先度付きキュー代わりに配列を使う（小規模ならOK）
  const dist = {};
  const prev = {};
  stations.forEach(st => { dist[st.id] = Infinity; });
  dist[start.id] = 0;

  let queue = [start.id];

  while (queue.length > 0) {
    // 距離が一番小さい駅を取り出す
    queue.sort((a, b) => dist[a] - dist[b]);
    const u = queue.shift();
    const uStation = stations.find(s => s.id === u);

    // 隣接駅を調べる
    const edges = [...uStation.neighbors, ...uStation.transfers];
    for (const edge of edges) {
      const v = edge.to;
      const alt = dist[u] + edge.time;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        if (!queue.includes(v)) queue.push(v);
      }
    }
  }

  // 経路を復元
  let path = [];
  let u = goal.id;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  return { distance: dist[goal.id], path };
}
