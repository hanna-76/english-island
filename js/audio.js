/* ============================================================
 * audio.js —— 英语发音控制
 * 使用浏览器自带的 Web Speech API（语音合成），
 * 不需要任何录音文件，手机浏览器和微信都支持。
 * ============================================================ */

const AudioManager = {
  muted: false,          // 是否静音
  rate: 0.85,            // 语速（儿童模式放慢一点）
  voice: null,           // 选中的英语发音人

  // 初始化：从 localStorage 读取静音状态，并找一个英语发音人
  init() {
    this.muted = localStorage.getItem("ei_muted") === "1";

    // 浏览器发音人列表是异步加载的
    const pickVoice = () => {
      const voices = window.speechSynthesis
        ? window.speechSynthesis.getVoices()
        : [];
      // 优先选 en-US 的女声（儿童听感更友好）
      this.voice =
        voices.find(v => /en[-_]US/i.test(v.lang) && /female|samantha|zira|google us english/i.test(v.name)) ||
        voices.find(v => /en[-_]US/i.test(v.lang)) ||
        voices.find(v => /^en/i.test(v.lang)) ||
        null;
    };
    pickVoice();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
  },

  // 朗读一段英文；如果静音或浏览器不支持，则静默跳过
  speak(text, onEnd) {
    if (this.muted || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }
    // 先取消正在朗读的，避免叠加
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = this.rate;
    if (this.voice) utter.voice = this.voice;

    if (onEnd) {
      utter.onend = onEnd;
      utter.onerror = onEnd;
    }
    window.speechSynthesis.speak(utter);
  },

  // 停止朗读
  stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  },

  // 切换静音，返回新的静音状态
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("ei_muted", this.muted ? "1" : "0");
    if (this.muted) this.stop();
    return this.muted;
  }
};
