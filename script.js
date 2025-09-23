// 仮の駅データ（JSONから読み込む形に後で差し替え可）
const stations = [
  "X", "Y", "Z", "XX", "XY"
];

// 入力補助を設定する関数
function setupAutocomplete(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestionsBox = document.getElementById(suggestionsId);

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!query) return;

    // 部分一致候補を探す
    const matches = stations.filter(st => st.toLowerCase().includes(query));

    // 候補を表示
    matches.forEach(match => {
      const div = document.createElement("div");
      div.textContent = match;
      div.className = "suggestion";
      div.addEventListener("click", () => {
        input.value = match;
        suggestionsBox.innerHTML = "";
      });
      suggestionsBox.appendChild(div);
    });
  });

  // フォーカス外れたら候補を消す
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== input) {
      suggestionsBox.innerHTML = "";
    }
  });
}

// 出発駅と到着駅にオートコンプリートを設定
setupAutocomplete("from", "from-suggestions");
setupAutocomplete("to", "to-suggestions");

// デモ検索
document.getElementById("search").addEventListener("click", () => {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();

  // 入力値バリデーション
  if (!stations.includes(from) || !stations.includes(to)) {
    document.getElementById("output").textContent = "エラー: 駅名が正しくありません。";
    return;
  }

  // textContent を使うことで XSS 防止
  document.getElementById("output").textContent = `検索: ${from} → ${to}`;
});

