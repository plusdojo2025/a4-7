import React, { useState, useEffect } from "react";
import SugorokuCell from "../components/SugorokuCell";
import Avatar from "../components/Avatar";
import TreasureBox from "../components/TreasureBox";

const SugorokuBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // ダミータスク取得（例：20個）
    setTimeout(() => {
      const dummyTasks = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `タスク${i + 1}`,
      }));
      setTasks(dummyTasks);
    }, 1000);
  }, []);

  const taskCount = tasks.length;

  if (taskCount < 4) {
    return <p>タスクが4つ未満のため、スゴロクは表示されません。</p>;
  }

  // 宝箱の位置を均等に4つ配置
  const treasurePositions = [
    Math.floor(taskCount * 1 / 5),
    Math.floor(taskCount * 2 / 5),
    Math.floor(taskCount * 3 / 5),
    Math.floor(taskCount * 4 / 5),
  ];

  return (
    <div className="sugoroku-board p-4 bg-green-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">夏休みスゴロク</h2>
      <div className="flex gap-2 flex-wrap">
        {tasks.map((task, index) => (
          <SugorokuCell key={index}>
            {position === index && <Avatar />}
            {treasurePositions.includes(index) && <TreasureBox />}
          </SugorokuCell>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={() => setPosition((prev) => Math.min(prev + 1, taskCount - 1))}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          すすむ
        </button>
      </div>
    </div>
  );
};

export default SugorokuBoard;
