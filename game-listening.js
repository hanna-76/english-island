/* ============================================================
 * game-listening.js —— 听音找图（3~5 岁核心玩法）
 * 播放单词发音，儿童从 2~4 张图中点选答案。
 * 低档：每轮 10 题，每题 2~4 张图，无倒计时。
 * ============================================================ */

const GameListening = {
  questions: [],     // 本轮题目
  index: 0,          // 当前题号
  correct: 0,        // 答对数量
  theme: null,       // 当前主题
  level: "easy",     // 难度：easy=2张图, normal=3张图, hard=4张图
  onFinish: null,    // 结束回调 (correct, total)

  // 开始一轮：传入主题对象、难度、结束回调
  start(theme, level, onFinish) {
    this.theme = theme;
    this.level = level;
    this.onFinish = onFinish;
    this.index = 0;
    this.correct = 0;

    // 从主题词表中抽 10 道题
    const wordPool = theme.words;
    this.questions = sample(wordPool, Math.min(10, wordPool.length));

    this.renderQuestion();
  },

  // 根据难度决定每题显示几张图
  optionCount() {
    if (this.level === "easy")   return 2;
    if (this.level === "normal") return 3;
    return 4;
  },

  // 渲染一道题
  renderQuestion() {
    const q = this.questions[this.index];
    const total = this.questions.length;

    // 顶部：进度
    App.showProgress(this.index + 1, total);

    // 中间：中文提示 + 重播按钮
    const stage = document.getElementById("stage");
    stage.innerHTML = `
      <div class="q-hint">
        <p class="q-cn">${q.zh}</p>
        <button class="btn-replay" id="btnReplay" aria-label="重播发音">
          🔊 再听一次
        </button>
      </div>
      <div class="img-options" id="imgOptions"></div>
    `;

    // 播放发音
    AudioManager.speak(q.en);

    // 重播按钮
    document.getElementById("btnReplay").onclick = () => {
      AudioManager.speak(q.en);
    };

    // 生成选项：正确答案 + 干扰项
    const distractors = sample(
      this.theme.words.filter(w => w.en !== q.en),
      this.optionCount() - 1
    );
    const options = shuffle([q, ...distractors]);

    const box = document.getElementById("imgOptions");
    box.innerHTML = "";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "img-card";
      btn.innerHTML = `<span class="emoji">${opt.emoji}</span>`;
      btn.onclick = () => this.handlePick(btn, opt, q);
      box.appendChild(btn);
    });
  },

  // 处理点选
  handlePick(btnEl, picked, answer) {
    const correct = picked.en === answer.en;

    if (correct) {
      this.correct++;
      btnEl.classList.add("right");
      AudioManager.speak("correct! great job!");
      // 中高档：答对后如果之前是错词，从错题本移除
      if (Store.removeWrong) Store.removeWrong(answer.en);
    } else {
      btnEl.classList.add("wrong");
      // 中高档：记录错词
      if (Store.recordWrong) Store.recordWrong(answer);
      AudioManager.speak("try again! listen carefully");
      // 答错：高亮正确答案，允许重试（不直接跳下一题）
      setTimeout(() => {
        // 找到正确答案卡片高亮
        const cards = document.querySelectorAll(".img-card");
        cards.forEach(c => c.classList.remove("wrong"));
        btnEl.classList.add("wrong");
        // 给提示：再听一次发音
        AudioManager.speak(answer.en);
      }, 800);
      // 不立刻跳下一题，等用户再点对（简化：2秒后自动进入下一题）
      setTimeout(() => this.next(), 2500);
      return;
    }

    // 答对：1 秒后进入下一题
    setTimeout(() => this.next(), 1000);
  },

  // 下一题或结算
  next() {
    this.index++;
    if (this.index >= this.questions.length) {
      if (this.onFinish) this.onFinish(this.correct, this.questions.length);
    } else {
      this.renderQuestion();
    }
  }
};
