import React, { useState, useEffect } from "react";
import axios from "axios";
import SugorokuCell from "../components/SugorokuCell";
import Avatar from "../components/Avatar";
import TreasureBox from "../components/TreasureBox";
import MenuHeader from "../components/MenuHeader";

import "./SugorokuPage.css";

const generateSpiralIndexes = (size) => {
  const spiral = Array.from({ length: size }, () => Array(size).fill(null));
  let value = 0,
    top = 0,
    bottom = size - 1,
    left = 0,
    right = size - 1;

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

const SugorokuPage = () => {
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodKey, setSelectedPeriodKey] = useState("");
  const [tasks, setTasks] = useState([]);
  const [position, setPosition] = useState(0);
  const [message, setMessage] = useState("");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState(["natsu/0.png"]);
  const [currentBackground, setCurrentBackground] = useState("natsu/0.png");
  const [showBgModal, setShowBgModal] = useState(false);
  const [openedTreasures, setOpenedTreasures] = useState([]);

  const backgroundMap = {
    1: { 1: "natsu/1.png", 2: "natsu/2.png", 3: "natsu/3.png", 4: "natsu/4.png" },
    4: { 1: "fuyu/1.png", 2: "fuyu/2.png", 3: "fuyu/3.png", 4: "fuyu/4.png" },
    5: { 1: "haru/1.png", 2: "haru/2.png", 3: "haru/3.png", 4: "haru/4.png" },
  };

  useEffect(() => {
    axios.get(`/api/vacations/user/1`).then((res) => {
      const formatted = res.data.map((v) => {
        const start = new Date(v.startDate);
        const end = new Date(v.endDate);
        const formatDate = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
        return {
          id: v.id,
          name: `${v.vacationName}（${formatDate(start)}〜${formatDate(end)}）`,
        };
      });
      setPeriods(formatted);
      if (formatted.length > 0) setSelectedPeriodKey(formatted[0].id);
    });
  }, []);

  useEffect(() => {
  // positionが変わったら
  // 現在のposition以下の宝箱のみをopenedTreasuresに残す
  const filteredTreasures = openedTreasures.filter((index) => index <= position);

  // openedTreasuresが変わるなら更新
  if (filteredTreasures.length !== openedTreasures.length) {
    setOpenedTreasures(filteredTreasures);
  }

  // その位置までに獲得可能な背景を決める（backgroundMapで位置対応）
  const map = backgroundMap[selectedPeriodKey] || {};
  let lastBg = "natsu/0.png"; // 初期背景

  // position以下で開けた宝箱の背景を順に最後のものにする
  filteredTreasures.forEach((idx) => {
    if (map[idx]) lastBg = map[idx];
  });

  // currentBackgroundが違ったらセットし直し＆localStorage更新
  if (lastBg !== currentBackground) {
    setCurrentBackground(lastBg);
    localStorage.setItem(`currentBackground-${selectedPeriodKey}`, lastBg);
  }
}, [position, selectedPeriodKey]);


  useEffect(() => {
    if (!selectedPeriodKey) return;
    const savedPos = localStorage.getItem(`sugoroku_position_${selectedPeriodKey}`);
    setPosition(savedPos !== null ? Number(savedPos) : 0);

    const savedTreasures = localStorage.getItem(`openedTreasures_${selectedPeriodKey}`);
    setOpenedTreasures(savedTreasures ? JSON.parse(savedTreasures) : []);

    axios.get(`/homeworkSchedules/?userId=1&vacationId=${selectedPeriodKey}`)
      .then(res => setTasks(res.data))
      .catch(() => setTasks([]));
  }, [selectedPeriodKey]);

  useEffect(() => {
    if (!selectedPeriodKey) return;
    localStorage.setItem(`sugoroku_position_${selectedPeriodKey}`, position);
  }, [position, selectedPeriodKey]);

  useEffect(() => {
  axios.get("/backgrounds")
    .then(res => {
      const backgrounds = res.data;
      const getPath = bg => bg.path || `natsu/${bg.id - 1}.png`;

      const initialUnlocked = backgrounds.length > 0 ? [getPath(backgrounds[0])] : [];

      // localStorage から保存済み背景を取得（なければ初期背景）
      const savedBg = localStorage.getItem(`currentBackground-${selectedPeriodKey}`);

      setUnlockedBackgrounds(initialUnlocked);
      setCurrentBackground(savedBg || initialUnlocked[0]);
    })
    .catch(err => {
      console.error("背景情報取得エラー", err);
      setUnlockedBackgrounds([]);
      setCurrentBackground(null);
    });
}, [selectedPeriodKey]);

  useEffect(() => {
    if (!selectedPeriodKey) return;
    localStorage.setItem(`openedTreasures_${selectedPeriodKey}`, JSON.stringify(openedTreasures));

    const map = backgroundMap[selectedPeriodKey] || {};
    const newUnlocked = ["natsu/0.png"];
    openedTreasures.forEach((index) => {
      if (map[index] && !newUnlocked.includes(map[index])) {
        newUnlocked.push(map[index]);
      }
    });
    setUnlockedBackgrounds(newUnlocked);
    if (!newUnlocked.includes(currentBackground)) {
      setCurrentBackground(newUnlocked[newUnlocked.length - 1]);
    }
  }, [openedTreasures, selectedPeriodKey]);

  useEffect(() => {
  const checkUpdate = () => {
    const updatedTime = localStorage.getItem('vacationsUpdated');
    if (updatedTime) {
      axios.get(`/api/vacations/user/1`).then((res) => {
        const formatted = res.data.map((v) => {
          const start = new Date(v.startDate);
          const end = new Date(v.endDate);
          const formatDate = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
          return {
            id: v.id,
            name: `${v.vacationName}（${formatDate(start)}〜${formatDate(end)}）`,
          };
        });
        setPeriods(formatted);
        if (!formatted.find(p => p.id === selectedPeriodKey)) {
          setSelectedPeriodKey(formatted.length > 0 ? formatted[0].id : null);
          setPosition(0);
          setOpenedTreasures([]);
        }
      });
      localStorage.removeItem('vacationsUpdated');
    }
  };

  window.addEventListener('storage', checkUpdate);

  return () => {
    window.removeEventListener('storage', checkUpdate);
  };
}, [selectedPeriodKey]);


  const handleTreasureClick = (taskIndex) => {
  if (position < taskIndex) return;

  if (openedTreasures.includes(taskIndex)) {
    setShowBgModal(true);
    return;
  }

  setOpenedTreasures((prev) => [...prev, taskIndex]);

  const bgPath = backgroundMap[selectedPeriodKey]?.[taskIndex];
  if (bgPath) {
    setCurrentBackground(bgPath);
    localStorage.setItem(`currentBackground-${selectedPeriodKey}`, bgPath); // ← 追加
  }

  setMessage("新しい背景を手に入れたよ！🎁");
  setTimeout(() => setMessage(""), 3000);
  setShowBgModal(true);
};


  const handleMoveForward = () => {
    setPosition((prev) => {
      const nextPos = prev + 1;
      if (nextPos >= tasks.length) return prev;
      if (!tasks[nextPos]?.completed) {
        setMessage("次の宿題を完了しないと進めません！");
        setTimeout(() => setMessage(""), 3000);
        return prev;
      }
      if (nextPos === tasks.length - 1) {
        setMessage("ゴール！がんばったね🎉");
        setTimeout(() => setMessage(""), 3000);
      }
      return nextPos;
    });
  };

  const size = Math.ceil(Math.sqrt(tasks.length));
  const spiral = generateSpiralIndexes(size);
  const treasurePositions = [
    Math.floor(tasks.length * 1 / 5),
    Math.floor(tasks.length * 2 / 5),
    Math.floor(tasks.length * 3 / 5),
    Math.floor(tasks.length * 4 / 5),
  ];

  const getArrow = (index) => {
    if (index >= tasks.length - 1) return "";
    const nextIndex = index + 1;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (spiral[r][c] === index) {
          const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
          for (let d = 0; d < 4; d++) {
            const [dr, dc] = directions[d];
            if (spiral[r + dr]?.[c + dc] === nextIndex) return ["→", "↓", "←", "↑"][d];
          }
        }
      }
    }
    return "";
  };

  return (
    <div className="sugoroku-page" style={{ backgroundImage: currentBackground ? `url(/${currentBackground})` : "none" }}>
      <MenuHeader />
      <h2 className="period-title">{periods.find((p) => p.id === selectedPeriodKey)?.name || "期間未選択"}</h2>
      <div className="period-select-wrapper">
        <label>期間選択：</label>
        <select
          value={selectedPeriodKey}
          onChange={(e) => {
            const newPeriodKey = Number(e.target.value);
            setSelectedPeriodKey(newPeriodKey);
            const saved = localStorage.getItem(`sugoroku_position_${newPeriodKey}`);
            const initial = saved !== null ? Number(saved) : 0;
            setPosition(initial);
            const savedTreasures = localStorage.getItem(`openedTreasures_${newPeriodKey}`);
            setOpenedTreasures(savedTreasures ? JSON.parse(savedTreasures) : []);
          }}
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {message && <div className="message-overlay"><div className="message-box">{message}</div></div>}

      {showBgModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>アンロックされた背景を選択</h3>
            <div className="bg-list">
              {unlockedBackgrounds.map((bg, i) => (
                <img
                  key={i}
                  src={`/${bg}`}
                  alt={`bg-${i}`}
                  className={bg === currentBackground ? "bg-img selected" : "bg-img"}
                  onClick={() => {
                    setCurrentBackground(bg);
                    localStorage.setItem(`currentBackground-${selectedPeriodKey}`, bg);
                    setShowBgModal(false);
                  }}
                />
              ))}
            </div>
            <button className="close-button" onClick={() => setShowBgModal(false)}>閉じる</button>
          </div>
        </div>
      )}

      <div className="board-wrapper">
        <div className="board-grid" style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}>
          {spiral.flat().map((taskIndex, i) => (
            <SugorokuCell key={i} isDone={taskIndex < position}>
              {taskIndex < tasks.length && (
                <>
                  {position === taskIndex && <Avatar />}
                  {treasurePositions.includes(taskIndex) && (
                    <div className="treasure-wrapper" onClick={() => handleTreasureClick(taskIndex)}>
                      <TreasureBox />
                    </div>
                  )}
                  <div className="task-content">
                    {taskIndex + 1}：{tasks[taskIndex]?.content || ""}
                    <span className="arrow">{taskIndex !== tasks.length - 1 && getArrow(taskIndex)}</span>
                  </div>
                  {taskIndex === tasks.length - 1 && <span className="goal-label">ゴール</span>}
                </>
              )}
            </SugorokuCell>
          ))}
        </div>
      </div>

      <div className="move-buttons">
        <button onClick={() => setPosition((prev) => Math.max(prev - 1, 0))} className="btn-back">もどる</button>
        <button onClick={handleMoveForward} className="btn-forward">すすむ</button>
      </div>
    </div>
  );
};

export default SugorokuPage;
