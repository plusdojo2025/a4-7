import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../components/MenuHeader';
import TaskHeader from '../components/TaskHeader';
import TriviaHeader from '../components/TriviaHeader';
import LogoHeader from '../components/LogoHeader';
import Header from '../components/Header'
import ScheduleExample from '../components/ScheduleExample';
import axios from 'axios';
import './SchedulePage.css';
import { withRouter } from '../withRouter'; 

class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // DBから取得するデータ
            vacations: [], // vacationIdでアクセスできる連想配列
            privateSchedules: [],
            columns: [],
            hwSchedules: [],
            backgroundUrl: '',

            // UIの状態
            showModal: false,
            selectedHwContents: [],
            selectedHwDate: '',
            dragData: null, 
            selectedVacationIdx: 0,
            showModalDecide: false,
            modalData: [],
            newPrivateSchedule: {},

            // その他
            userId: localStorage.getItem('userId') || "",
            vacationId: props.vacationId,
            setVacationId: props.setVacationId, 
            today: props.today,
            setTodayTasks: props.setTodayTasks
        };
    }

    // componentDidUpdate(prevProps, prevState) {
    //     // props.today が変わったかを検知
    //     // console.log("prevProps",prevProps.today);
    //     // console.log("prevState",prevState.today);
    //     // console.log("this.props.today",this.props.today);
    //     // console.log("this.state.today",this.state.today);
    //     // if (prevState.today !== this.state.today) {
    //     //     console.log("todayが変更されました:", this.props.today);

    //         // // 例: todayに基づいてタスクを更新する処理
    //         // this.props.setTodayTasks(this.props.today);
            
    //         // // 必要に応じて state に反映
    //         // this.setState({ today: this.props.today });
    //     }
    // }


    // --------------------------------------------------------------
    componentDidMount() {
        const {userId, today} = this.state;
        if (!userId) {
            //alert('ログインしてください');
            window.location.href = '/';
        }

        // 背景画像の取得
            axios.get('/users/' + userId)
            .then(userRes => {
                const backgroundId = userRes.data.backgroundId;
                return axios.get('/backgrounds/' + backgroundId, {responseType: 'blob'});
            })
            .then(bgRes => {
                const blob = bgRes.data;
                const imageUrl = URL.createObjectURL(blob);
                this.setState({
                    backgroundUrl: imageUrl
                });
            })
            .catch(error => {
                console.error('背景画像の取得に失敗しました:', error);
            })
        


        // まずは休暇情報を取得
        axios.get('/api/vacations/user/' + userId)
        .then(json => {
            console.log(json.data);
            // 空データのときは何もしない
            if (!json.data || json.data.length === 0) {
                console.log('休暇データが空です');
                return;
            }
            const vacationsById = {};            
            json.data.forEach(item => { // vacationIdでアクセスできる連想配列を作成
                vacationsById[item.id] = item;
            });
            const firstKey = Object.keys(vacationsById)[0]; // 最初のID
            const newVacationId = this.state.vacationId ? this.state.vacationId : firstKey; // vacationIdが空の時に最初のIDを入れる

            this.setState({
                vacations: vacationsById,
                vacationId: newVacationId
            }, 
            () => {            
                const selectedVacation = this.state.vacations[this.state.vacationId];
                // 休暇情報を取得した後に、選択された休暇の予定(私用・宿題)を取得
                if (selectedVacation) {
                this.setPrivateSchedules(userId, selectedVacation.id);
                this.setColumns(userId, selectedVacation.id);
                this.setHomeworkSchedules(userId, selectedVacation.id);
                } else {
                    console.error('選択された休暇情報が見つかりません');
                }
            }
            );
        })   
        // .then(_=>{
        //     // 日付が変わった時のモーダル表示
        //     this.dicisionBotton(today);
        // })  

        
    }
    

    // DBからデータを取得してセットする関数 ------------------------------------
    setPrivateSchedules = (userId, vacationId) => {
        fetch("/privateSchedules/?userId="+userId+"&vacationId="+vacationId)
            .then(response => {return response.json()})
            .then (json => {
                console.log(json);  
                this.setState({
                    privateSchedules: json
                });
            });
    }

    setColumns = (userId, vacationId) => {
        fetch("/columns/?userId="+userId+"&vacationId="+vacationId)
            .then(response => {return response.json()})
            .then (json => {
                console.log(json);  
                this.setState({
                    columns: json
                });
            });
    }

    setHomeworkSchedules = (userId, vacationId) => {
        const {today, setTodayTasks}= this.state;
        fetch("/homeworkSchedules/?userId="+userId+"&vacationId="+vacationId)
            .then(response => {return response.json()})
            .then (json => {
                console.log(json);  
                this.setState({
                    hwSchedules: json
                });
                setTodayTasks(json.filter(content => content.contentDate === today))
            })
            .catch(error => {
            console.error("宿題取得エラー:", error);
            });
        
            
    }

    setVacations = (userId) => {
        axios.get('/api/vacations/user/' + userId)
            .then(json => {
                console.log(json.data);
                this.setState({
                    vacations: json.data,
                })
            })
    }

    // プライベート予定編集関連の関数-------------------------------------
    // TODO:空文字になった時の削除処理
    // 私用の予定を入力する処理
    psInput = (event, idx) => {
        const updatedPrivateSchedule = this.state.privateSchedules[idx];
        updatedPrivateSchedule.content = event.target.value; // 入力された内容を更新

        this.setState(prevState => {
            const updatedPrivateSchedules = [...prevState.privateSchedules];
            updatedPrivateSchedules[idx] = updatedPrivateSchedule; // 更新された予定をセット
            return { privateSchedules: updatedPrivateSchedules };
        });
    }

    // 編集した私用の予定をDBに保存する処理
    editPrivateSchedule = (idx) => {
        const { privateSchedules, userId, vacations, vacationId } = this.state;
        const updatedPsSchedule = privateSchedules[idx];

        axios.post('/privateSchedules/mod/', updatedPsSchedule)
        .then (json => {
            console.log(json);
            this.setPrivateSchedules(userId, vacationId)
        });
    }

    // 新規私用予定の入力処理（stateで一時的に保持）
    psInputNew = (event, date) => {
        const { userId, vacations, vacationId } = this.state;
        const content = event.target.value;
        this.setState( prevState => {
            const newPrivateSchedule = {
                userId: userId,
                vacationId: vacationId,
                contentDate: date,
                content: content
            };
            return {
                newPrivateSchedule: newPrivateSchedule,
                privateSchedules: [...prevState.privateSchedules, newPrivateSchedule]
            }
        });
    }

    // 新規私用予定をDBに登録する処理
    createPrivateSchedule = () => {
        const { newPrivateSchedule, userId, vacations, vacationId } = this.state;

        if (!newPrivateSchedule || !newPrivateSchedule.content || newPrivateSchedule.content.trim() === "") {
            // 入力が空なら何もしない
            return;
        }

        // DBにPOST
        axios.post('/privateSchedules/mod/', newPrivateSchedule)
            .then(json => {
            console.log("新規予定登録成功:", json);

            // 登録後はnewPrivateScheduleをクリア
            this.setState({ newPrivateSchedule: null });

            // 一覧を再取得
            this.setPrivateSchedules(userId, vacationId);
            })
            .catch(error => {
            console.error("新規予定登録エラー:", error);
            });
    }

    // 休暇選択----------------------------------------------------------
    handleVacationChange = (event) => {
        const { userId, vacations, setVacationId } = this.state;
        const selectedVacationId = Number(event.target.value);
        setVacationId(selectedVacationId);
        this.setState({
            vacationId: selectedVacationId,
        }, () => {
            // 休暇が変更された後にデータを再取得
            // this.setPrivateSchedules(userId, vacations[this.state.vacationId].id)
            // this.setColumns(userId, vacations[this.state.vacationId].id)
            // this.setHomeworkSchedules(userId, vacations[this.state.vacationId].id)
            this.setPrivateSchedules(userId, selectedVacationId);
            this.setColumns(userId, selectedVacationId);
            this.setHomeworkSchedules(userId, selectedVacationId);
            
        });
    }

    // 宿題タスクのチェックボックス--------------------------------------
    handleCheckboxChange = (event, content) => {
        const { userId, vacationId } = this.state;
        const updatedHwSchedule = content;
        updatedHwSchedule.completed = event.target.checked;
        
        axios.post('/homeworkSchedules/mod/', updatedHwSchedule)
        .then (json => {
            console.log(json);
            this.setHomeworkSchedules(userId, vacationId);
        });
    }

    // モーダル表示---------------------------------------------------------
    openModal = (contents, date) => {
        this.setState({
            showModal: true,
            selectedHwContents: contents,
            selectedHwDate: date,
        });
    };

    closeModal = () => {
        this.setState({ showModal: false, showModalDecide: false });
    };

    // 宿題タスクの移動処理 -------------------------------------------------

    // ドラッグ開始時の処理
    onDragStart = (colIndex, date, contentIndex) => {
        this.setState({ dragData: { colIndex, date, contentIndex } });
    };

    onDragOver = (e, colIndex) => {
        e.preventDefault(); // ドロップを許可する
        const { dragData } = this.state;
        if (!dragData) return;

        if (dragData.colIndex === colIndex) {
            e.dataTransfer.dropEffect = 'move';
        } else {
            e.dataTransfer.dropEffect = 'none'; // cursor: no-dropにするため
        }
    };

    // ドロップゾーンにドラッグが入ったときの処理
    onDragEnter = (e, colIndex) => {
        const { dragData } = this.state;
        const dropable = dragData && dragData.colIndex === colIndex;
        const dropZone = e.currentTarget;

        dropZone.classList.add(dropable ? 'dropable' : 'undropable');
    };

    // ドロップゾーンからドラッグが離れたときの処理
    onDragLeave = (e) => {
        const dropZone = e.currentTarget;
        dropZone.classList.remove('dropable', 'undropable');
    };
    
    
    onDrop = (colIndex, date) => {
        const { dragData, hwSchedules, userId, vacations, vacationId } = this.state;
        if (!dragData) return;

        const dropZone = document.querySelectorAll('.drop-zone');
        dropZone.forEach(el => el.classList.remove('dropable', 'undropable'));

        const draggedItem = hwSchedules[dragData.contentIndex];

        // ドラッグした宿題と同じ列であることを確認
        if (dragData.colIndex !== colIndex) return;

        const updatedHwSchedule = {            
            ...draggedItem,
            contentDate: date, // 日付だけを変更
        };

        axios.post('/homeworkSchedules/mod/', updatedHwSchedule)
        .then (json => {
            console.log(json);
            this.setHomeworkSchedules(userId, vacationId);
        });

    };

    // --------------------------------------------------------------   
    // 開始日と終了日から日付と曜日の配列を作成
    makeDateRange(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateRange = [];
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD形式
            const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
            dateRange.push({ date: formattedDate, dayOfWeek: dayOfWeek });
        }
        return dateRange;
    }

    // 休暇の決定ボタンが押されたときの処理
    dicisionBotton = (date) => {
        console.log("modal", date)
        const { userId, vacationId, vacations, hwSchedules} = this.state;
        const requests = [];
        const modalData = [];
        let sugorokuCount = 0;

        // 次の日付を決定する処理
        const nextDateTemp = new Date(date);
        nextDateTemp.setDate(nextDateTemp.getDate() + 1);
        const nextDate = nextDateTemp.toISOString().split('T')[0]; // YYYY-MM-DD形式       

        // 休暇テーブルの決定日(dicision_date)を次の日に移行         
        // const updatedVacation = { ...vacations[vacationId], decisionDate: nextDate};
        // requests.push(
        //     axios.post('/api/vacations/mod/', updatedVacation)
        //     .then (json => {console.log(json);})
        // );

        // チェックされていない今日の宿題タスクを次の日に移行する
        hwSchedules.filter(content => content.contentDate === date && !content.completed).forEach(content => {
            const updatedContent = { ...content, contentDate: nextDate };
            requests.push(
                axios.post('/homeworkSchedules/mod/', updatedContent)
                .then (json => {console.log(json);})
            );
        });

        // 前倒しでチェックされた宿題タスクを今日に移行する
        hwSchedules.filter(content => content.contentDate > date && content.completed).forEach(content => {
            const updatedContent = { ...content, contentDate: date };
            requests.push(
                axios.post('/homeworkSchedules/mod/', updatedContent)
                .then (json => {console.log(json);})
            );
            sugorokuCount++;
        });

        // 前日より前のチェックを外した宿題タスクを次の日に移行する
        hwSchedules.filter(content => content.contentDate < date && !content.completed).forEach(content => {
            const updatedContent = { ...content, contentDate: nextDate};
            requests.push(
                axios.post('/homeworkSchedules/mod/', updatedContent)
                .then (json => {console.log(json);})
            );
            sugorokuCount--;
        });

        // 今日のチェックされた宿題タスクをカウント
        hwSchedules.filter(content => content.contentDate === date && content.completed).forEach(_ => {
            sugorokuCount++;
        });

        // モーダル表示準備
        if (sugorokuCount >= 0) {
            modalData.push(`${sugorokuCount}マス進めます`);
        }
        else{
            modalData.push(`${-sugorokuCount}マス戻りました`);
        }

        // modalData.push('背景〇〇をゲットしました'); // TODO
        modalData.push('イベントで〇位でした'); // TODO
        modalData.push('アバター〇〇をゲットしました'); // TODO
        
        // すべてのaxiosリクエストが完了するのを待つ
        Promise.all(requests)
        .then(() => {
            this.setState({
                showModalDecide: true,
                modalData: modalData
            });
            this.setVacations(userId);
            this.setHomeworkSchedules(userId, vacationId);
        })
        .catch(error => {console.error("APIエラー:", error);});
    }

    // --------------------------------------------------------------   
    setAllCheck = () => {
        const {hwSchedules, userId, vacationId} = this.state;
        hwSchedules.map((hwSchedule, _) => {
            const checkedHwSchedule = {...hwSchedule, completed:1}
            console.log("チェック", checkedHwSchedule);
            axios.post('/homeworkSchedules/mod/', checkedHwSchedule)
            .then (json => {
                console.log(json);
                this.setHomeworkSchedules(userId, vacationId);
            });
        })
    }

    // main -----------------------------------------------------------   
    render() {
        const { 
            vacations, 
            privateSchedules, 
            columns, 
            hwSchedules, 
            showModal, 
            selectedHwDate, 
            selectedHwContents,
            selectedVacationIdx,
            showModalDecide,
            backgroundUrl,
            modalData, 
            vacationId
        } = this.state;


        if (!vacations || vacations.length === 0) { // componentDidMount前および初ログイン時はvacationsが空
            return ( 
                <div>
                    <div>
                        <select>
                            <option>予定を作成してください</option>
                        </select>
                        <Link to="/scheduleMake"> {/* リロードしないリンク */}
                            <button>新しい予定を作成</button>
                        </Link>
                        {/* <button onClick={()=>{window.location.href = '/scheduleMake'}}>新しい予定を作成</button> */}
                    </div>
                    <div className="example-layer">
                        <div className="schedule-wrapper">
                            <ScheduleExample />
                            <div className="overlay" />
                        </div>
                        <span className="example-text">予定の例</span>
                    </div>

                </div>
            );
        } 

        const dateRange = this.makeDateRange(vacations[vacationId].startDate, vacations[vacationId].endDate);

        return (
            <div 
                // className='backgroundImage' 
                // style={
                //     backgroundUrl
                //     ? { backgroundImage: `url(${backgroundUrl})` }
                //     : { backgroundColor: "#282c34" } // fallback 背景
                // }
            >
                
            
            {/* <div className='backgroundImage' style={{ backgroundImage:`url(bg2.png)`}}> */}
                {/* <ul id='header'>
                    <li><TriviaHeader today={vacations[selectedVacationIdx].decisionDate}/></li>
                    <li><LogoHeader/></li>
                    <li>
                        <TaskHeader 
                            taskList={hwSchedules.filter(content => content.contentDate === vacations[selectedVacationIdx].decisionDate)}
                            checkBoxChange={this.handleCheckboxChange}                     
                        />
                    </li>
                </ul>
                <Menu></Menu> */}

                {/* <Header /> */}

                {/* 休暇の選択 および 新しい予定の作成ボタン */}
                <div>
                    <select onChange={this.handleVacationChange} value={vacationId}>
                        {/* {vacations.map((vacation, index) => (
                            <option key={index}>
                                {vacation.vacationName + ' (' + vacation.startDate + ' - ' + vacation.endDate + ')'}
                            </option>
                        ))} */}
                        {Object.entries(vacations).map(([id, vacation]) => (
                            <option key={id} value={id}>
                                {vacation.vacationName + ' (' + vacation.startDate + ' - ' + vacation.endDate + ')'}
                            </option>
                        ))}
                    </select>
                    <Link to="/scheduleMake"> {/* リロードしないリンク */}
                        <button>新しい予定を作成</button>
                    </Link>
                    {/* <button onClick={()=>{window.location.href = '/scheduleMake'}}>新しい予定を作成</button> */}
                </div>

                {/* 私用・宿題の予定表 */}
                <div id="scheduleOuterContainer">
                <div id="scheduleContainer">
                <table id="scheduleTable">
                    <thead>
                        <tr>
                            <th>日付</th>
                            <th>曜日</th>
                            <th>予定</th>
                            {columns.map((col, index) => ( 
                                <th key={index}>{col.columnTitle}</th>
                            ))}
                            <th><button onClick={this.setAllCheck}>全チェック</button></th>

                        </tr>
                    </thead>
                    <tbody>
                        {dateRange.map((date, index) => (
                            <tr key={index}> 
                                <td>{date.date}</td>
                                <td>{date.dayOfWeek}</td>

                                {/* 私用の予定 */}
                                <td> 
                                    {/* TODO: DBにないdateの場合のテキスト入力欄を表示 */}
                                    {/* {privateSchedules.map((event, idx) => {
                                        return event.contentDate.split('T')[0]===date.date ? (
                                        <textarea key={idx} value={event.content} 
                                            onChange={(e)=>{this.psInput(e, idx)}} // 入力された内容を更新
                                            onBlur={()=>{this.editPrivateSchedule(idx)}} // 入力が終わったらDBを更新
                                        />
                                        ):null
                                    })} */}
                                    {(() => {
                                        // 該当日の私用予定を探す
                                        const eventIdx = privateSchedules.findIndex(event => event.contentDate.split('T')[0] === date.date);
                                        if (eventIdx !== -1) {
                                        // 予定がある場合はその内容のtextareaを表示
                                        return (
                                            <textarea
                                            value={privateSchedules[eventIdx].content}
                                            onChange={(e) => this.psInput(e, eventIdx)}
                                            onBlur={() => this.editPrivateSchedule(eventIdx)}
                                            />
                                        );
                                        } else {
                                        // 予定がない場合は空のtextareaを表示
                                        return (
                                            <textarea
                                            value={""}
                                            onChange={(e) => this.psInputNew(e, date.date)}  // 新規入力用に別関数でも良いです
                                            onBlur={() => this.createPrivateSchedule(date.date)}  // 新規登録用関数（あれば）
                                            />
                                        );
                                        }
                                    })()}
                                </td>

                                {/* 宿題の予定 */}
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} 
                                        className="drop-zone"
                                        onDragOver={(e)=> this.onDragOver(e, colIdx)} 
                                        onDragEnter={(e) => this.onDragEnter(e, colIdx)}
                                        onDragLeave={this.onDragLeave}
                                        onDrop={() => this.onDrop(colIdx, date.date)}
                                    >
                                    
                                        {
                                            // hwSchedules.filter(content => ((content.contentDate === date.date)&&(content.columnInfoId === col.id))).length > 1 ? (
                                            false ? (
                                                // TODO: モーダルじゃなくて列挙する
                                                // TODO: モーダル内の宿題のチェックボックスのDB反映
                                                <span
                                                    onClick={() =>
                                                        this.openModal(
                                                            hwSchedules.filter(content => ((content.contentDate === date.date)&&(content.columnInfoId === col.id))),
                                                            date.date
                                                        )
                                                    }
                                                >
                                                    {hwSchedules.filter(content => ((content.contentDate === date.date)&&(content.columnInfoId === col.id))).length} 件の予定
                                                </span>
                                            ):(
                                                hwSchedules.map((content, contentIndex) => {
                                                    return ((content.contentDate === date.date)&&(content.columnInfoId === col.id)) ? (
                                                        <div key={contentIndex} 
                                                            className="draggable"
                                                            draggable
                                                            onDragStart={() => this.onDragStart(colIdx, content.contentDate, contentIndex)}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={content.completed}
                                                                onChange={(e) =>
                                                                    this.handleCheckboxChange(e, content)
                                                                }
                                                            />
                                                            {content.content}
                                                        </div>
                                            ): null;
                                            })
                                        )                                               
                                        }                                   
                                    </td>
                                ))}

                                {
                                    // vacations[vacationId].decisionDate === date.date ? (
                                    //     <td><button onClick={()=>{this.dicisionBotton(date.date)}}>次の日へ</button></td>
                                    // ) : null
                                }

                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                </div>

                {/* まとめて表示された複数タスクをモーダル表示 */}
                {showModal && (
                    <div id='modal'>
                        <div id='modalContent'>
                            <h3>{selectedHwDate} の宿題</h3>
                            <ul>
                                {selectedHwContents.map((content, idx) => (
                                    <li key={idx}>
                                        <input
                                            type="checkbox"
                                            checked={content.checked}
                                            readOnly
                                        />{" "}
                                        {content.content}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={this.closeModal}>閉じる</button>
                        </div>
                    </div>
                )}

                {/* 次の日に移行したときのモーダル表示 */}
                {showModalDecide && (
                    <div id='modal'>
                        <div id='modalContent'>
                            {modalData.map((message, idx) => (
                                <p key={idx}>{message}</p>
                            ))}
                            <button onClick={this.closeModal}>閉じる</button>
                        </div>
                    </div>
                )}
 
            </div>
        );
    }
}
export default (SchedulePage);