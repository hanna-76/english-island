/* ============================================================
 * data.js —— 低档题库：3 个主题 × 10 词 = 30 词
 * 主题：动物、水果、颜色
 * ============================================================ */

const THEMES = [
  {
    id: "animals",
    name: "动物",
    icon: "🐾",
    words: [
      { en: "cat",    zh: "猫",   emoji: "🐱" },
      { en: "dog",    zh: "狗",   emoji: "🐶" },
      { en: "duck",   zh: "鸭子", emoji: "🦆" },
      { en: "rabbit", zh: "兔子", emoji: "🐰" },
      { en: "fish",   zh: "鱼",   emoji: "🐟" },
      { en: "bird",   zh: "鸟",   emoji: "🐦" },
      { en: "bear",   zh: "熊",   emoji: "🐻" },
      { en: "panda",  zh: "熊猫", emoji: "🐼" },
      { en: "monkey", zh: "猴子", emoji: "🐵" },
      { en: "elephant", zh: "大象", emoji: "🐘" }
    ]
  },
  {
    id: "fruits",
    name: "水果",
    icon: "🍎",
    words: [
      { en: "apple",  zh: "苹果", emoji: "🍎" },
      { en: "banana", zh: "香蕉", emoji: "🍌" },
      { en: "orange", zh: "橙子", emoji: "🍊" },
      { en: "grape",  zh: "葡萄", emoji: "🍇" },
      { en: "watermelon", zh: "西瓜", emoji: "🍉" },
      { en: "strawberry", zh: "草莓", emoji: "🍓" },
      { en: "peach",  zh: "桃子", emoji: "🍑" },
      { en: "pear",   zh: "梨",   emoji: "🍐" },
      { en: "lemon",  zh: "柠檬", emoji: "🍋" },
      { en: "cherry", zh: "樱桃", emoji: "🍒" }
    ]
  },
  {
    id: "colors",
    name: "颜色",
    icon: "🎨",
    words: [
      { en: "red",    zh: "红色", emoji: "🔴" },
      { en: "blue",   zh: "蓝色", emoji: "🔵" },
      { en: "yellow", zh: "黄色", emoji: "🟡" },
      { en: "green",  zh: "绿色", emoji: "🟢" },
      { en: "purple", zh: "紫色", emoji: "🟣" },
      { en: "orange", zh: "橙色", emoji: "🟠" },
      { en: "pink",   zh: "粉色", emoji: "🌸" },
      { en: "black",  zh: "黑色", emoji: "⚫" },
      { en: "white",  zh: "白色", emoji: "⚪" },
      { en: "brown",  zh: "棕色", emoji: "🟤" }
    ]
  }
];

// 低档只用这3个主题
function getThemesByLevel() { return THEMES; }

// 从数组中随机取 n 个元素（不重复）
function sample(arr, n) {
  const copy = arr.slice();
  const result = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

// 打乱数组顺序
function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
