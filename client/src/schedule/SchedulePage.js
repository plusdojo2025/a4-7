import React from 'react';
import Menu from '../components/MenuHeader';
import TaskHeader from '../components/TaskHeader';
import TriviaHeader from '../components/TriviaHeader';
import axios from 'axios';
import './SchedulePage.css';

export default class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // DBから取得するデータ
            vacations: [], 
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

            // その他
            userId: 1, // TODO: ユーザIDを動的に取得する
        };
    }

    // --------------------------------------------------------------
    componentDidMount() {

        const { selectedVacationIdx, userId} = this.state;

        // 背景画像の取得
            axios.get('/users/' + userId)
            .then(userRes => {
                const backgroundId = userRes.data.backgroundId;
                return axios.get('/backgrounds/' + backgroundId, {
                // return axios.get('/backgrounds/7', {
                responseType: 'blob'
                });
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
            this.setState({
                vacations: json.data,
            }, () => {                
                // TODO: 複数fetchをまとめて実行する方法を検討
                // 休暇情報を取得した後に、選択された休暇の予定(私用・宿題)を取得
                fetch("/privateSchedules/?userId="+userId+"&vacationId="+this.state.vacations[selectedVacationIdx].id)
                .then(response => {return response.json()})
                .then (json => {
                    console.log(json);  
                    this.setState({
                        privateSchedules: json
                    });
                });
                
                fetch("/columns/?userId="+userId+"&vacationId="+this.state.vacations[selectedVacationIdx].id)
                .then(response => {return response.json()})
                .then (json => {
                    console.log(json);  
                    this.setState({
                        columns: json
                    });
                });

                fetch("/homeworkSchedules/?userId="+userId+"&vacationId="+this.state.vacations[selectedVacationIdx].id)
                .then(response => {return response.json()})
                .then (json => {
                    console.log(json);  
                    this.setState({
                        hwSchedules: json
                    });
                });
            }
            );
        })     
    }

    // プライベート予定編集関連の関数-------------------------------------
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
        const updatedPsSchedule = this.state.privateSchedules[idx];

        axios.post('/privateSchedules/mod/', updatedPsSchedule)
        .then (json => {
            console.log(json);
            this.componentDidMount();
        });
    }

    // 休暇選択----------------------------------------------------------
    handleVacationChange = (event) => {
        this.setState({
            selectedVacationIdx: event.target.selectedIndex,
        }, () => {
            // 休暇が変更された後にデータを再取得
            this.componentDidMount();
        });
    }

    // 宿題タスクのチェックボックス--------------------------------------
    handleCheckboxChange = (event, content) => {
        const updatedHwSchedule = content;
        updatedHwSchedule.completed = event.target.checked;
        
        axios.post('/homeworkSchedules/mod/', updatedHwSchedule)
        .then (json => {
            console.log(json);
            this.componentDidMount();
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
        const { dragData, hwSchedules } = this.state;
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
            this.componentDidMount();
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
        const { selectedVacationIdx, vacations, hwSchedules} = this.state;
        const requests = [];
        const modalData = [];
        let sugorokuCount = 0;

        // 次の日付を決定する処理
        const nextDateTemp = new Date(date);
        nextDateTemp.setDate(nextDateTemp.getDate() + 1);
        const nextDate = nextDateTemp.toISOString().split('T')[0]; // YYYY-MM-DD形式       

        // 休暇テーブルの決定日(dicision_date)を次の日に移行         
        const updatedVacation = { ...vacations[selectedVacationIdx], decisionDate: nextDate};
        requests.push(
            axios.post('/api/vacations/mod/', updatedVacation)
            .then (json => {console.log(json);})
        );

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
            modalData.push(`${sugorokuCount}マス進みました`);
        }
        else{
            modalData.push(`${-sugorokuCount}マス戻りました`);
        }

        modalData.push('背景〇〇をゲットしました'); // TODO
        modalData.push('イベントで〇位でした'); // TODO
        modalData.push('アバター〇〇をゲットしました'); // TODO
        
        // すべてのaxiosリクエストが完了するのを待つ
        Promise.all(requests)
        .then(() => {
            this.setState({
                showModalDecide: true,
                modalData: modalData
            });
            this.componentDidMount();
        })
        .catch(error => {console.error("APIエラー:", error);});
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
            modalData
        } = this.state;


        if (!vacations || vacations.length === 0) { // componentDidMount前および初ログイン時はvacationsが空
            return <div>休暇情報がありません。</div>;
        } 
        const dateRange = this.makeDateRange(vacations[selectedVacationIdx].startDate, vacations[selectedVacationIdx].endDate);

        return (
            <div className='backgroundImage' style={
                backgroundUrl
                ? { backgroundImage: `url(${backgroundUrl})` }
                : { backgroundColor: "#282c34" } // fallback 背景
            }>
            {/* <div className='backgroundImage' style={{ backgroundImage:`url(bg2.png)`}}> */}
                <ul id='header'>
                    <li><TriviaHeader today={vacations[selectedVacationIdx].decisionDate}/></li>
                    <li><h1>Schedule Page</h1></li>
                    <li>
                        <TaskHeader 
                            taskList={hwSchedules.filter(content => content.contentDate === vacations[selectedVacationIdx].decisionDate)}
                            checkBoxChange={this.handleCheckboxChange}                     
                        />
                    </li>
                </ul>
                <Menu></Menu>

                {/* 休暇の選択 および 新しい予定の作成ボタン */}
                <div>
                    <select onChange={this.handleVacationChange}>
                        {vacations.map((vacation, index) => (
                            <option key={index}>
                                {vacation.vacationName + ' (' + vacation.startDate + ' - ' + vacation.endDate + ')'}
                            </option>
                        ))}
                    </select>
                    <button onClick={()=>{window.location.href = '/scheduleMake'}}>新しい予定を作成</button>
                </div>

                {/* 私用・宿題の予定表 */}
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
                                    {privateSchedules.map((event, idx) => {
                                        return event.contentDate.split('T')[0]===date.date ? (
                                        <input type="text" key={idx} value={event.content} 
                                            onChange={(e)=>{this.psInput(e, idx)}} // 入力された内容を更新
                                            onBlur={()=>{this.editPrivateSchedule(idx)}} // 入力が終わったらDBを更新
                                        />
                                        ):null
                                    })}
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
                                    vacations[selectedVacationIdx].decisionDate === date.date ? (
                                        <td><button onClick={()=>{this.dicisionBotton(date.date)}}>次の日へ</button></td>
                                    ) : null
                                }

                                
                            </tr>
                        ))}
                    </tbody>
                </table>
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
