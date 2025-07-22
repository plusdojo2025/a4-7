import React, { useState } from "react";
import SugorokuCell from "../components/SugorokuCell";
import Avatar from "../components/Avatar";
import TreasureBox from "../components/TreasureBox";
import MenuHeader from "../components/MenuHeader";

// 螺旋インデックス生成関数
const generateSpiralIndexes = (size) => {
  const spiral = Array.from({ length: size }, () => Array(size).fill(null));
  let value = 0, top = 0, bottom = size - 1, left = 0, right = size - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) spiral[top][i] = value++;
    top++;
    for (let i = top; i <= bottom; i++) spiral[i][right] = value++;
    right--;
    for (let i = right; i >= left; i--) spiral[bottom][i] = value++;
    bottom--;
    for (let i = bottom; i >= top; i--) spiral[i][left] = value++;
    left++;
  }
  return spiral;
};

// 期間ごとのデータ（仮のダミー）
const periods = [
  {
    label: "夏休み（2023-07-20 - 2023-08-31）",
    key: "summer",
    tasks: [
      { id: 1, title: "漢字プリント" },
      { id: 2, title: "算数ドリル" },
      { id: 3, title: "読書感想文" },
      { id: 4, title: "自由研究" },
      { id: 5, title: "工作" },
      { id: 6, title: "日記を書く" },
      { id: 7, title: "歴史調べ" },
      { id: 8, title: "理科観察" },
      { id: 9, title: "音読練習" },
      { id: 10, title: "英単語練習" },
    ],
  },
  {
    label: "冬休み（2023-12-25 - 2024-01-07）",
    key: "winter",
    tasks: [
      { id: 1, title: "年賀状を書く" },
      { id: 2, title: "雪遊び" },
      { id: 3, title: "おもちを食べる" },
      { id: 4, title: "書き初め" },
      { id: 5, title: "家の手伝い" },
    ],
  },
  {
    label: "春休み（2024-03-20 - 2024-04-05）",
    key: "spring",
    tasks: [
      { id: 1, title: "お花見" },
      { id: 2, title: "部屋の掃除" },
      { id: 3, title: "入学準備" },
      { id: 4, title: "図書館へ行く" },
      { id: 5, title: "日記を書く" },
      { id: 6, title: "春の絵を描く" },
    ],
  },
];

const SugorokuPage = () => {
  const [selectedPeriodKey, setSelectedPeriodKey] = useState("summer");
  const selectedPeriod = periods.find(p => p.key === selectedPeriodKey);
  const tasks = selectedPeriod.tasks;

  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState("");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState(["bg1.png"]);
  const [currentBackground, setCurrentBackground] = useState("bg1.png");
  const [showBgModal, setShowBgModal] = useState(false);
  


  const taskCount = tasks.length;
  const size = Math.ceil(Math.sqrt(taskCount));
  const spiral = generateSpiralIndexes(size);

  const treasurePositions = [
    Math.floor(taskCount * 1 / 5),
    Math.floor(taskCount * 2 / 5),
    Math.floor(taskCount * 3 / 5),
    Math.floor(taskCount * 4 / 5),
  ];

  const bgMap = {
    [Math.floor(taskCount * 1 / 5)]: "bg2.png",
    [Math.floor(taskCount * 2 / 5)]: "bg3.png",
    [Math.floor(taskCount * 3 / 5)]: "bg4.png",
    [Math.floor(taskCount * 4 / 5)]: "bg5.png",
  };

  const handleTreasureClick = (taskIndex) => {
    if (position < taskIndex) return;
    const bg = bgMap[taskIndex];
    if (bg && !unlockedBackgrounds.includes(bg)) {
      setUnlockedBackgrounds((prev) => [...prev, bg]);
      setCurrentBackground(bg);
      setMessage("宝箱ゲット！🎉");
      setTimeout(() => setMessage(""), 3000);
    }
    if (bg) {
      setShowBgModal(true);
    }
  };

  const handleMoveForward = () => {
    setPosition((prev) => {
      const nextPos = Math.min(prev + 1, taskCount - 1);
      if (nextPos === taskCount - 1) {
        setMessage("ゴール！がんばったね🎉");
        setTimeout(() => setMessage(""), 3000);
      }
      return nextPos;
    });
  };

  const getArrow = (index) => {
    if (index >= taskCount - 1) return "";
    const nextIndex = index + 1;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (spiral[r][c] === index) {
          const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
          for (let d = 0; d < 4; d++) {
            const nr = r + directions[d][0];
            const nc = c + directions[d][1];
            if (nr >= 0 && nc >= 0 && nr < size && nc < size) {
              if (spiral[nr][nc] === nextIndex) return ["→", "↓", "←", "↑"][d];
            }
          }
        }
      }
    }
    return "";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(/${currentBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MenuHeader />
      <h2 style={{ fontSize: "24px", textAlign: "center", color: "#fff", marginTop: "10px" }}>
        {selectedPeriod.label}
      </h2>

      {/* プルダウン */}
      <div style={{ textAlign: "center", marginTop: "10px", color: "#fff" }}>
        <label>期間選択：</label>
        <select
          value={selectedPeriodKey}
          onChange={(e) => {
            setSelectedPeriodKey(e.target.value);
            setPosition(0);
          }}
        >
          {periods.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* メッセージ */}
      {message && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 10000
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "30px 50px", borderRadius: "12px",
            fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center"
          }}>
            {message}
          </div>
        </div>
      )}

      {/* 背景選択モーダル */}
      {showBgModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 11000
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "10px", padding: "20px",
            maxWidth: "90%", maxHeight: "80%", overflowY: "auto", textAlign: "center"
          }}>
            <h3>アンロックされた背景を選択</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              {unlockedBackgrounds.map((bgImg, idx) => (
                <img key={idx} src={`/${bgImg}`} alt={`bg-${idx}`}
                  style={{
                    width: 100, height: 80, objectFit: "cover",
                    border: bgImg === currentBackground ? "3px solid #3b82f6" : "1px solid #ccc",
                    borderRadius: "8px", cursor: "pointer"
                  }}
                  onClick={() => {
                    setCurrentBackground(bgImg);
                    setShowBgModal(false);
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setShowBgModal(false)}
              style={{
                marginTop: "20px", padding: "8px 20px", cursor: "pointer",
                borderRadius: "6px", border: "none", backgroundColor: "#f59e0b", color: "#fff", fontWeight: "bold"
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* スゴロクマップ */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: "30px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${size}, 80px)`, gap: "10px",
          backgroundColor: "rgba(255,255,255,0.8)", padding: "20px", borderRadius: "12px"
        }}>
          {spiral.flat().map((taskIndex, i) => (
            <SugorokuCell key={i}>
              {taskIndex < taskCount && (
                <>
                  {position === taskIndex && <Avatar />}
                  {treasurePositions.includes(taskIndex) && (
                    <div onClick={() => handleTreasureClick(taskIndex)} style={{ cursor: "pointer" }}>
                      <TreasureBox />
                    </div>
                  )}
                  <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {taskIndex + 1}：{tasks[taskIndex].title}
                    <span style={{ fontSize: "12px", marginLeft: "4px" }}>
                      {taskIndex !== taskCount - 1 && getArrow(taskIndex)}
                    </span>
                  </div>
                  {taskIndex === taskCount - 1 && (
                    <span style={{ color: "red", fontSize: "12px" }}>ゴール</span>
                  )}
                </>
              )}
            </SugorokuCell>
          ))}
        </div>
      </div>

      {/* ボタン */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setPosition((prev) => Math.max(prev - 1, 0))}
          style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          もどる
        </button>
        <button
          onClick={handleMoveForward}
          style={{ padding: "10px 20px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          すすむ
        </button>
      </div>
    </div>
  );
};

export default SugorokuPage;
