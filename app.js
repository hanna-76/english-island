/* ============================================================
 * app.js —— 低档版主应用
 * 流程：首页 → 主题选择 → 听音答题 → 结算
 * ============================================================ */

const App = {
  init() {
    AudioManager.init();
    const btnMute = document.getElementById("btnMute");
    btnMute.onclick = () => {
      AudioManager.toggleMute();
      btnMute.textContent = AudioManager.muted ? "🔇" : "🔊";
    };
    this.showHome();
  },

  showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  },

  showHome() {
    this.showScreen("screenHome");
  },

  showThemeSelect() {
    this.showScreen("screenTheme");
    const wrap = document.getElementById("themeGrid");
    wrap.innerHTML = "";
    THEMES.forEach(t => {
      const btn = document.createElement("button");
      btn.className = "theme-card";
      btn.innerHTML = `
        <span class="emoji">${t.icon}</span>
        <span>${t.name}</span>
        <small>${t.words.length} 个单词</small>
      `;
      btn.onclick = () => this.startGame(t);
      wrap.appendChild(btn);
    });
  },

  startGame(theme) {
    GameListening.start(theme, "easy", (correct, total) => this.showResult(theme, correct, total));
    this.showScreen("screenGame");
  },

  showProgress(cur, total) {
    document.getElementById("progressBar").style.width = (cur / total * 100) + "%";
  },

  showResult(theme, correct, total) {
    const accuracy = Math.round(correct / total * 100);
    let stars = accuracy >= 80 ? 3 : accuracy >= 60 ? 2 : 1;
    let starStr = "";
    for (let i = 0; i < 3; i++) starStr += i < stars ? "⭐" : "☆";

    this.showScreen("screenResult");
    document.getElementById("resultText").innerHTML = `
      <div class="stars">${starStr}</div>
      <p class="result-score">${correct} / ${total} 正确</p>
      <p class="result-acc">正确率 ${accuracy}%</p>
    `;
  },

  confirmExit() {
    if (confirm("要退出这一关吗？")) this.showHome();
  }
};

window.addEventListener("DOMContentLoaded", () => App.init());
