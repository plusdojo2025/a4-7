import React, { useState, useEffect } from "react";
import SugorokuCell from "../components/SugorokuCell";
import Avatar from "../components/Avatar";
import TreasureBox from "../components/TreasureBox";
import MenuHeader from "../components/MenuHeader";

// 螺旋インデックス生成関数
const generateSpiralIndexes = (size) => {
  const spiral = Array.from({ length: size }, () => Array(size).fill(null));
  let value = 0;
  let top = 0, bottom = size - 1, left = 0, right = size - 1;

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
  const [tasks, setTasks] = useState([]);
  const [position, setPosition] = useState(0);
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState(["bg1.png"]);
  const [currentBackground, setCurrentBackground] = useState("bg1.png");

  useEffect(() => {
    const dummyTasks = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `タスク${i + 1}`,
    }));
    setTasks(dummyTasks);
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
    [Math.floor(taskCount * 1 / 5)]: "bg2.png",
    [Math.floor(taskCount * 2 / 5)]: "bg3.png",
    [Math.floor(taskCount * 3 / 5)]: "bg4.png",
    [Math.floor(taskCount * 4 / 5)]: "bg5.png",
  };

  const arrowIcons = ["→", "↓", "←", "↑"];
  const getArrow = (index) => {
    if (index >= taskCount - 1) return "";
    const nextIndex = index + 1;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (spiral[r][c] === index) {
          const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0],
          ];
          for (let d = 0; d < 4; d++) {
            const nr = r + directions[d][0];
            const nc = c + directions[d][1];
            if (nr >= 0 && nc >= 0 && nr < size && nc < size) {
              if (spiral[nr][nc] === nextIndex) return arrowIcons[d];
            }
          }
        }
      }
    }
    return "";
  };

  const handleTreasureClick = (taskIndex) => {
    const bg = bgMap[taskIndex];
    if (bg && !unlockedBackgrounds.includes(bg)) {
      setUnlockedBackgrounds([...unlockedBackgrounds, bg]);
      setCurrentBackground(bg);
    }
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
        夏休みスゴロク
      </h2>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${size}, 80px)`,
            gap: "10px",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
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
                    {taskIndex + 1}
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

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setPosition((prev) => Math.max(prev - 1, 0))}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          もどる
        </button>

        <button
          onClick={() => setPosition((prev) => Math.min(prev + 1, taskCount - 1))}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          すすむ
        </button>
      </div>
    </div>
  );
};

export default SugorokuPage;
