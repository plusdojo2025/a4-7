import React, { useState, useEffect } from "react";
import axios from "axios";
import SugorokuCell from "../components/SugorokuCell";
import Avatar from "../components/Avatar";
import TreasureBox from "../components/TreasureBox";
import MenuHeader from "../components/MenuHeader";
import TriviaHeader from '../components/TriviaHeader';
import Header from '../components/Header'
import "../components/Background.css";

import "./SugorokuPage.css";
import { withRouter } from "../withRouter";

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

const SugorokuPage = ({changeBackground}) => {
  const [periods, setPeriods] = useState([]); // 休暇の選択に必要
  const [selectedPeriodKey, setSelectedPeriodKey] = useState(""); // vacationIDのこと
  // const [selectedPeriod, setSelectedPeriod] = useState(""); // vacationsのこと
  const [tasks, setTasks] = useState([]); // 総マス数の計算に必要
  const [completedTasks, setCompletedTasks] = useState([]); // 進めるマスの最大数の計算に必要
  const [position, setPosition] = useState(0); // 0がスタートマス
  const [message, setMessage] = useState("");
  const [showBgModal, setShowBgModal] = useState(false);
  const [userId, _] = useState(localStorage.getItem('userId') || "");
  const [bgImgsUrlIdList, setBgImgsUrlIdList] = useState([]); // [[url, background_id], ...]
  const [treasurePositions, setTreasurePositions] = useState([]); 

  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState(["natsu/0.png"]);
  const [currentBackground, setCurrentBackground] = useState([]); // [url, background_id]
  const [openedTreasures, setOpenedTreasures] = useState([]);

  const backgroundMap = {
    1: { 1: "natsu/1.png", 2: "natsu/2.png", 3: "natsu/3.png", 4: "natsu/4.png" },
    4: { 1: "fuyu/1.png", 2: "fuyu/2.png", 3: "fuyu/3.png", 4: "fuyu/4.png" },
    5: { 1: "haru/1.png", 2: "haru/2.png", 3: "haru/3.png", 4: "haru/4.png" },
  };

  //  初期設定 ----------------------------------------
  useEffect(() => {
    // 期間データ取得
    axios.get(`/api/vacations/user/${userId}`).then((res) => {
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
      if (formatted.length > 0) {
        setSelectedPeriodKey(formatted[0].id);
        // setSelectedPeriod(formatted[0])
      };
    });

    // 背景画像取得 および 背景にセット
    getAndSetBackground(userId);
    
  }, []);

  // 選択期間が変わったらデータロード ----------------------------------------
  useEffect(() => {
    if (!selectedPeriodKey) return;
    const vacationsId = selectedPeriodKey

    // 現在位置の取得
    axios.get(`/api/vacations/${selectedPeriodKey}`)
    .then(json => {
      setPosition(json.data.currentLocation);
    })

    // 総マス数(タスクの数)、進める最大マス数(チェックされたタスクの数)の取得
    axios
      .get(`/homeworkSchedules/?userId=${userId}&vacationId=${selectedPeriodKey}`)
      .then((res) => {
        setTasks(res.data);
        // setCompletedTasks(res.data.map((task) => task.completed));
        setCompletedTasks(res.data.filter(task => task.completed === true));
      })
      .catch(() => {
        setTasks([]);
        setCompletedTasks([]);
      });

    // 報酬画像の取得
    axios.get(`/uvbgs/${vacationsId}`)
      .then(json => {console.log("指定した休暇に属する背景画像の一覧:", json.data); return json.data})
      .then(json => {
        return Promise.all( // 非同期の管理のためにPromiseを使用
          json.map(bgImgs => 
                axios.get('/backgrounds/' + bgImgs.backgroundsId, { responseType: 'blob' })
                .then(blob => [URL.createObjectURL(blob.data), bgImgs.backgroundsId])
                .catch(error =>  {console.error('報酬画像の取得に失敗しました:', error);})
          )
        );
      })
      .then(url_ids => {
        console.log("取得した背景画像のURL一覧:", url_ids); 
        setBgImgsUrlIdList(url_ids);
      })


  }, [selectedPeriodKey]);

  // 宝箱の位置を決める -----------------------------------
  useEffect(() => {
    // const treasurePositions = [
    //   Math.floor(tasks.length * 1 / 4),
    //   Math.floor(tasks.length * 2 / 4),
    //   Math.floor(tasks.length * 3 / 4),
    //   Math.floor(tasks.length),
    // ];
    if (bgImgsUrlIdList.length === 0 || tasks.length === 0) return;
    const interval = tasks.length / bgImgsUrlIdList.length;
    const treasurePositions = bgImgsUrlIdList.map((_, idx) => Math.floor(interval * (idx + 1)));
    setTreasurePositions(treasurePositions);

  }, [tasks, bgImgsUrlIdList])

  // position保存 ----------------------------------------
  useEffect(() => {
    if (!selectedPeriodKey) return;
    // localStorage.setItem(`sugoroku_position_${selectedPeriodKey}`, position);
    axios.get("/api/vacations/" + selectedPeriodKey)
    .then(json => {
      json.data.currentLocation = position;
      return json.data;
    })
    .then(json => {
      axios.post("/api/vacations/mod/", json)
      .then(json => {console.log(json.data)})    
    })

  }, [position]);

  // 宝箱アンロック ----------------------------------------
  // useEffect(() => {
  //   if (!treasurePositions.includes(position)) return;   

  // }, [position]);

  // すすむボタン -----------------------------------------
  const handleMoveForward = () => {
    setPosition((prev) => {
      const nextPos = prev + 1;
      if (nextPos === 0) return nextPos; // スタートは常にOK
      if (nextPos > tasks.length) {
        setMessage("これ以上進めません！");
        setTimeout(() => setMessage(""), 1000);
        return prev;
      }
      // if (!tasks[nextPos - 1]?.completed) {
      if (nextPos > completedTasks.length) {
        setMessage("次の宿題を完了しないと進めません！");
        setTimeout(() => setMessage(""), 1000);
        return prev;
      }
      if (treasurePositions.includes(nextPos)) {
        setMessage("新しい背景を手に入れたよ！🎁");
      }
      if (nextPos === tasks.length) {
        setMessage("ゴール！がんばったね🎉");
      }
      setTimeout(() => setMessage(""), 1000);
      return nextPos;
    });
  };

  // 背景切換え ---------------------------------------------
  const handleTreasureClick = (backgroundId) => {
    axios.get(`/users/${userId}`)
      .then(json => {
        json.data.backgroundId = backgroundId;
        return json.data
      })
      .then(userInfo => {
        axios.post(`./users`, userInfo)
        .then(_=> {
          console.log(`背景をid=${backgroundId}に変更しました`); 
          getAndSetBackground(userId);
        })
        .catch(error =>  {console.error('ユーザ情報の登録に失敗しました:', error);})
      })
      .catch(error =>  {console.error('ユーザ情報の取得に失敗しました:', error);})
  }

  // 背景画像取得 および 背景にセット --------------------------
  const getAndSetBackground = (userId) => {

    axios.get(`/users/${userId}`)
      .then(json => {return json.data.backgroundId})
      .then(backgroundId => {
        axios.get(`/backgrounds/${backgroundId}`, { responseType: 'blob' })
          .then(blob => {return [URL.createObjectURL(blob.data), backgroundId]})
          .then(bgImgUrlId => {
            console.log("背景画像",bgImgUrlId); 
            setCurrentBackground(bgImgUrlId);
            changeBackground(bgImgUrlId[0]);
          })
          .catch(error =>  {console.error('背景画像の取得に失敗しました:', error);})
      })      
      .catch(error =>  {console.error('ユーザー情報の取得に失敗しました:', error);})
  }

  // 現在位置リセット(テスト用) ------------------------------
  const positionReset = () => setPosition(0);

  // -----------------------------------------
  // // position変化で宝箱と背景管理
  // useEffect(() => {
  //   const filteredTreasures = openedTreasures.filter((index) => index <= position);

  //   if (filteredTreasures.length !== openedTreasures.length) {
  //     setOpenedTreasures(filteredTreasures);
  //   }

  //   const map = backgroundMap[selectedPeriodKey] || {};
  //   let lastBg = "natsu/0.png"; // 初期背景

  //   filteredTreasures.forEach((idx) => {
  //     if (map[idx]) lastBg = map[idx];
  //   });

  //   if (lastBg !== currentBackground) {
  //     setCurrentBackground(lastBg);
  //     localStorage.setItem(`currentBackground-${selectedPeriodKey}`, lastBg);
  //   }
  // }, [position, selectedPeriodKey]);

  


  // // 背景データ取得
  // useEffect(() => {
  //   axios
  //     .get("/backgrounds")
  //     .then((res) => {
  //       const backgrounds = res.data;
  //       const getPath = (bg) => bg.path || `natsu/${bg.id - 1}.png`;
  //       const initialUnlocked = backgrounds.length > 0 ? [getPath(backgrounds[0])] : [];
  //       const savedBg = localStorage.getItem(`currentBackground-${selectedPeriodKey}`);

  //       setUnlockedBackgrounds(initialUnlocked);
  //       setCurrentBackground(savedBg || initialUnlocked[0]);
  //     })
  //     .catch((err) => {
  //       console.error("背景情報取得エラー", err);
  //       setUnlockedBackgrounds([]);
  //       setCurrentBackground(null);
  //     });
  // }, [selectedPeriodKey]);

  // // 宝箱開封管理・アンロック背景更新
  // useEffect(() => {
  //   if (!selectedPeriodKey) return;
  //   localStorage.setItem(`openedTreasures_${selectedPeriodKey}`, JSON.stringify(openedTreasures));

  //   const map = backgroundMap[selectedPeriodKey] || {};
  //   const newUnlocked = ["natsu/0.png"];
  //   openedTreasures.forEach((index) => {
  //     if (map[index] && !newUnlocked.includes(map[index])) {
  //       newUnlocked.push(map[index]);
  //     }
  //   });
  //   setUnlockedBackgrounds(newUnlocked);
  //   if (!newUnlocked.includes(currentBackground)) {
  //     setCurrentBackground(newUnlocked[newUnlocked.length - 1]);
  //   }
  // }, [openedTreasures, selectedPeriodKey]);

//   // completedTasksが変わったらposition巻き戻し等
//  useEffect(() => {
//   const lastCompletedIndex = completedTasks.lastIndexOf(true);

//   if (lastCompletedIndex + 1 < position) {
//     const newPosition = lastCompletedIndex + 1;
//     setPosition(newPosition);

//     const newOpened = openedTreasures.filter(i => i <= newPosition);
//     setOpenedTreasures(newOpened);

//     if (newOpened.length > 0) {
//       const lastBgIndex = Math.max(...newOpened);
//       const bgPath = backgroundMap[selectedPeriodKey]?.[lastBgIndex] ?? "natsu/0.png";
//       setCurrentBackground(bgPath);
//       localStorage.setItem(`currentBackground-${selectedPeriodKey}`, bgPath);
//     } else {
//       const initialBg = "natsu/0.png";
//       setCurrentBackground(initialBg);
//       localStorage.setItem(`currentBackground-${selectedPeriodKey}`, initialBg);
//     }
//   }
// }, [completedTasks]);


  // 期間更新検知（storageイベント）
  // useEffect(() => {
  //   const checkUpdate = () => {
  //     const updatedTime = localStorage.getItem("vacationsUpdated");
  //     if (updatedTime) {
  //       axios.get(`/api/vacations/user/1`).then((res) => {
  //         const formatted = res.data.map((v) => {
  //           const start = new Date(v.startDate);
  //           const end = new Date(v.endDate);
  //           const formatDate = (d) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  //           return {
  //             id: v.id,
  //             name: `${v.vacationName}（${formatDate(start)}〜${formatDate(end)}）`,
  //           };
  //         });
  //         setPeriods(formatted);
  //         if (!formatted.find((p) => p.id === selectedPeriodKey)) {
  //           setSelectedPeriodKey(formatted.length > 0 ? formatted[0].id : null);
  //           setPosition(0);
  //           setOpenedTreasures([]);
  //         }
  //       });
  //       localStorage.removeItem("vacationsUpdated");
  //     }
  //   };

  //   window.addEventListener("storage", checkUpdate);
  //   return () => {
  //     window.removeEventListener("storage", checkUpdate);
  //   };
  // }, [selectedPeriodKey]);

  // 宝箱クリック処理
 // handleTreasureClick の中身
// const handleTreasureClick = (taskIndex) => {
//   console.log("宝箱クリック", taskIndex, "position", position);
//   if (position < taskIndex) return; // 進行位置が足りないなら無効

//   if (openedTreasures.includes(taskIndex)) {
//     setShowBgModal(true);
//     return;
//   }

//   setOpenedTreasures((prev) => [...prev, taskIndex]);

//   const bgPath = backgroundMap[selectedPeriodKey]?.[taskIndex];
//   if (bgPath) {
//     setCurrentBackground(bgPath);
//     localStorage.setItem(`currentBackground-${selectedPeriodKey}`, bgPath);
//   }

//   setMessage("新しい背景を手に入れたよ！🎁");
//   setTimeout(() => setMessage(""), 3000);
//   setShowBgModal(true);
// };

 

  const size = Math.ceil(Math.sqrt(tasks.length + 1));
  const spiral = generateSpiralIndexes(size);




  // // 宿題の完了切り替え
  // const handleTaskToggle = (index) => {
  //   const newTasks = [...tasks];
  //   newTasks[index].completed = !newTasks[index].completed;
  //   setTasks(newTasks);
  //   setCompletedTasks(newTasks.map((task) => task.completed));
  // };

  // // 矢印表示（隣接セル方向）
  const getDirection = (index) => {
  if (index >= tasks.length) return null; // 最後は矢印なし
  const nextIndex = index + 1;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (spiral[r][c] === index) {
        const directions = [
          [0, 1, "right"],
          [1, 0, "down"],
          [0, -1, "left"],
          [-1, 0, "up"],
        ];
        for (let d = 0; d < 4; d++) {
          const [dr, dc, dir] = directions[d];
          if (spiral[r + dr]?.[c + dc] === nextIndex) return dir;
        }
      }
    }
  }
  return null;
};
  

  return (
      <div 
        // className='sugoroku-page' 
        // style={
        //           currentBackground[0]
        //           ? { backgroundImage: `url(${currentBackground[0]})` }
        //           : { backgroundColor: "#282c34" } 
        // }
      >
        {/* <Header/> */}

      <h2 className="period-title">{periods.find((p) => p.id === selectedPeriodKey)?.name || "期間未選択"}</h2>
      <div className="period-select-wrapper">
        <label>期間選択：</label>
        <select
          value={selectedPeriodKey}
          onChange={(e) => {
            const newPeriodKey = Number(e.target.value);
            setSelectedPeriodKey(newPeriodKey);
            // const saved = localStorage.getItem(`sugoroku_position_${newPeriodKey}`);
            // const initial = saved !== null ? Number(saved) : 0;
            // setPosition(initial);
            const savedTreasures = localStorage.getItem(`openedTreasures_${newPeriodKey}`);
            setOpenedTreasures(savedTreasures ? JSON.parse(savedTreasures) : []);
          }}
        >
          {periods.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className="message-overlay">
          <div className="message-box">{message}</div>
        </div>
      )}

      {/* {showBgModal && (
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
            <button className="close-button" onClick={() => setShowBgModal(false)}>
              閉じる
            </button>
          </div>
        </div>
      )} */}

      <div className="board-wrapper">
  <div className="board-grid" style={{ gridTemplateColumns: `repeat(${size}, 80px)` }}>
    {spiral.flat().map((taskIndex, i) => (
      taskIndex < tasks.length + 1 ? (
        <SugorokuCell
          key={i}
          isDone={taskIndex < position}
          direction={getDirection(taskIndex)}
          isLast={taskIndex === tasks.length}
        >
          {taskIndex < tasks.length + 1 && (
            <>
              {/* アバター */}
              {position === taskIndex && <Avatar />}

              {/* 宝箱 */}
              {treasurePositions.includes(taskIndex) && (
                <div className="treasure-wrapper">
                  {taskIndex <= position ? (
                    <div onClick={() => handleTreasureClick(bgImgsUrlIdList[treasurePositions.indexOf(taskIndex)][1])}>
                      <img src={bgImgsUrlIdList[treasurePositions.indexOf(taskIndex)][0]} className="treasure" />
                      <img src="/treasurebox_open.png" alt="宝箱" className="treasure" />
                    </div>
                  ) : (
                    <TreasureBox />
                  )}
                </div>
              )}

              {/* スタートとゴールラベル */}
              {taskIndex === 0 && <span className="start-label">スタート</span>}
              {taskIndex === tasks.length && <span className="goal-label">ゴール</span>}
            </>
          )}
        </SugorokuCell>
      ) : (
        <div key={i} />
      )
    ))}
  </div>
</div>


      <div className="move-buttons">
        {/* <button onClick={() => setPosition((prev) => Math.max(prev - 1, 0))} className="btn-back">
          もどる
        </button> */}
        <button onClick={handleMoveForward} className="btn-forward">
          すすむ
        </button>
        <button onClick={positionReset}>
          現在位置リセット
        </button>
      </div>
    </div>
  );
};

export default (SugorokuPage);
