import React, { useState, useEffect } from "react";
import axios from "axios";
import SugorokuCell from "../components/SugorokuCell";
import Avatar from "../components/Avatar";
import TreasureBox from "../components/TreasureBox";
import MenuHeader from "../components/MenuHeader";

// 螺旋インデックス生成関数（そのままでOK）
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

// SugorokuPage.js
const SugorokuPage = () => {
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodKey, setSelectedPeriodKey] = useState(1);
  const periodId = selectedPeriodKey;

  const [background, setBackground] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState("");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState(["bg1.png"]);
  const [currentBackground, setCurrentBackground] = useState("bg1.png");
  const [showBgModal, setShowBgModal] = useState(false);

  const periodBackgrounds = {
    1: "natsu",
    4: "fuyu",
    5: "haru",
  };
  // selectedPeriodKeyが変わったら宿題データを取得
useEffect(() => {
  if (selectedPeriodKey) {
    axios.get(`/homeworkSchedules/?userId=1&vacationId=${selectedPeriodKey}`)
      .then((res) => {
        setTasks(res.data);
        const completedCount = res.data.filter((task) => task.completed).length;
        setPosition(completedCount);
      })
      .catch((err) => {
        console.error("宿題取得エラー", err);
      });

    // 季節ごとの初期背景を設定
    let folder = "natsu"; // default 夏
    if (selectedPeriodKey === 5) folder = "haru";
    else if (selectedPeriodKey === 4) folder = "fuyu";
    setUnlockedBackgrounds([`${folder}/0.png`]);
    setCurrentBackground(`${folder}/0.png`);
  }
}, [selectedPeriodKey]);

  useEffect(() => {
  if (periodId) {
    let folder = "natsu"; // デフォルトは夏

    if (periodId === 5) folder = "haru";
    else if (periodId === 4) folder = "fuyu";

    // 初期背景は 0.png 固定
    setBackground(`/${folder}/0.png`);
  }
}, [periodId]);


 useEffect(() => {
  const userId = 1;

  axios.get(`http://localhost:8080/api/vacations/user/${userId}`)
    .then((res) => {
      console.log("取得成功", res.data);
      const formatted = res.data.map((v) => {
        const start = new Date(v.startDate);
        const end = new Date(v.endDate);

        // 日付整形（例：2025年7月20日）
        const formatDate = (date) =>
          `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

        return {
          id: v.id,
          name: `${v.vacationName}（${formatDate(start)}〜${formatDate(end)}）`
        };
      });
      setPeriods(formatted);
      if (formatted.length > 0) {
        setSelectedPeriodKey(formatted[0].id);
      }
    })
    .catch((err) => {
      console.error("休暇データ取得エラー", err);
      setPeriods([]);
    });
}, []);


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
    [Math.floor(taskCount * 1 / 5)]: "1.png",
    [Math.floor(taskCount * 2 / 5)]: "2.png",
    [Math.floor(taskCount * 3 / 5)]: "3.png",
    [Math.floor(taskCount * 4 / 5)]: "4.png",
  };

  const handleTreasureClick = (taskIndex) => {
  if (position < taskIndex) return;

  const bg = getRandomBackground();
  if (!unlockedBackgrounds.includes(bg)) {
    setUnlockedBackgrounds(prev => [...prev, bg]);
    setCurrentBackground(bg);
    setMessage("新しい背景を手に入れたよ！🎁");
    setTimeout(() => setMessage(""), 3000);
  } else {
    setMessage("すでにゲットした背景だよ");
    setTimeout(() => setMessage(""), 2000);
  }

  setShowBgModal(true);
};

  const getRandomBackground = () => {
  let folder = "natsu";
  if (selectedPeriodKey === 5) folder = "haru";
  else if (selectedPeriodKey === 4) folder = "fuyu";

  const randomIndex = Math.floor(Math.random() * 5); // 0〜4
  return `${folder}/${randomIndex}.png`;
};


  const handleMoveForward = () => {
  setPosition(prev => {
    const nextPos = prev + 1;
    if (nextPos >= taskCount) {
      return prev; // もう最後のマスなので進まない
    }
    // 次のタスクが完了しているかチェック
    if (!tasks[nextPos]?.completed) {
      setMessage("次の宿題を完了しないと進めません！");
      setTimeout(() => setMessage(""), 3000);
      return prev; // 進まない
    }
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

  if (periods.length === 0) return <div>期間データ読み込み中...</div>;
  if (!selectedPeriodKey) return <div>期間を選択してください</div>;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundImage: `url(/${currentBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      flexDirection: "column"
    }}>
      <MenuHeader />

      <h2 style={{ fontSize: "24px", textAlign: "center", color: "#fff", marginTop: "10px" }}>
        {periods.find(p => p.id === selectedPeriodKey)?.name || "期間未選択"}
      </h2>

      {/* 期間選択 */}
      <div style={{ textAlign: "center", marginTop: "10px", color: "#fff" }}>
        <label>期間選択：</label>
        <select
          value={selectedPeriodKey}
          onChange={e => {
            setSelectedPeriodKey(Number(e.target.value));
            setPosition(0);
          }}
        >
          {periods.map(period => (
            <option key={period.id} value={period.id}>{period.name}</option>
          ))}
        </select>
      </div>

      {/* メッセージ */}
      {message && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "30px 50px",
            borderRadius: "12px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center"
          }}>
            {message}
          </div>
        </div>
      )}

      {/* 背景選択モーダル */}
      {showBgModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 11000
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "90%",
            maxHeight: "80%",
            overflowY: "auto",
            textAlign: "center"
          }}>
            <h3>アンロックされた背景を選択</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              {unlockedBackgrounds.map((bgImg, idx) => (
                <img
                  key={idx}
                  src={`/${bgImg}`}
                  alt={`bg-${idx}`}
                  style={{
                    width: 100,
                    height: 80,
                    objectFit: "cover",
                    border: bgImg === currentBackground ? "3px solid #3b82f6" : "1px solid #ccc",
                    borderRadius: "8px",
                    cursor: "pointer"
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
                marginTop: "20px",
                padding: "8px 20px",
                cursor: "pointer",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#f59e0b",
                color: "#fff",
                fontWeight: "bold"
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
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 80px)`,
          gap: "10px",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "20px",
          borderRadius: "12px"
        }}>
          {spiral.flat().map((taskIndex, i) => (
           <SugorokuCell
  key={i}
  isDone={taskIndex < position}  // ここで position に達しているか判定
>

              {taskIndex < taskCount && (
                <>
                  {position === taskIndex && <Avatar />}
                  {treasurePositions.includes(taskIndex) && (
                    <div onClick={() => handleTreasureClick(taskIndex)} style={{ cursor: "pointer" }}>
                      <TreasureBox />
                    </div>
                  )}
                  <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {taskIndex + 1}：{tasks[taskIndex].content}
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
          onClick={() => setPosition(prev => Math.max(prev - 1, 0))}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          もどる
        </button>
        <button
          onClick={handleMoveForward}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          すすむ
        </button>
      </div>
    </div>
  );
};

export default SugorokuPage;
