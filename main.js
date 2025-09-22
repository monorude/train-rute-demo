let stations = [];

// JSONデータを読み込む
fetch("stations.json")
  .then(res => res.json())
  .then(data => { stations = data; });

// 探索ボタン
document.getElementById("searchBtn").addEventListener("click", () => {
  const startName = document.getElementById("start").value;
  const goalName = document.getElementById("goal").value;

  const path = searchRoute(startName, goalName);
  document.getElementById("result").textContent = JSON.stringify(path, null, 2);
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
