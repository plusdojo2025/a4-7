import React from 'react';
import Menu from '../components/MenuHeader';
import TaskHeader from '../components/TaskHeader';
import axios from 'axios';

export default class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vacationStart: '2025-07-19',
            vacationEnd: '2025-08-31',
            vacations: [
                { name: '夏休み', start: '2025-07-19', end: '2025-08-31' },
                { name: '冬休み', start: '2023-12-20', end: '2024-01-10' },
                { name: '春休み', start: '2024-03-20', end: '2024-04-05' }
            ],
            privateSchedules: [],
            columns: [],
            hwSchedules: [],
            showModal: false,
            selectedHwContents: [],
            selectedHwDate: '',
            dragData: null, 
            today: "2025-07-21",
            userId: 1,
            vacationId: 1
        };
    }

    // TODO: 複数fetchをまとめて実行する方法を検討
    componentDidMount() {

        // 初期化やデータの取得などの処理をここに記述
        // axios.get("/privateSchedules/", {params: {
        //     userId: 1,
        //     vacationId: 1
        // }
        // })
        fetch("/privateSchedules/?userId="+this.state.userId+"&vacationId="+this.state.vacationId) // TODO: 上行のaxiosがうまくいかない
        .then(response => {return response.json()})
        .then (json => {
            console.log(json);  
            this.setState({
                privateSchedules: json
            });
        });

        fetch("/columns/?userId="+this.state.userId+"&vacationId="+this.state.vacationId)
        .then(response => {return response.json()})
        .then (json => {
            console.log(json);  
            this.setState({
                columns: json
            });
        });
        fetch("/homeworkSchedules/?userId="+this.state.userId+"&vacationId="+this.state.vacationId)
        .then(response => {return response.json()})
        .then (json => {
            console.log(json);  
            this.setState({
                hwSchedules: json
            });
        });
    }

    

    handleVacationChange = (event) => {
        const selectedVacation = this.state.vacations.find(v => v.name === event.target.value);
        if (selectedVacation) {
            this.setState({
                vacationStart: selectedVacation.start,
                vacationEnd: selectedVacation.end
            });
        }
    }

    makeDateRange(start, end) {
        // 開始日と終了日から日付と曜日の配列を作成
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

    psInput = (event, idx) => {
        // 私用の予定を入力する処理
        const updatedPrivateSchedule = this.state.privateSchedules[idx];
        updatedPrivateSchedule.content = event.target.value; // 入力された内容を更新

        this.setState(prevState => {
            const updatedPrivateSchedules = [...prevState.privateSchedules];
            updatedPrivateSchedules[idx] = updatedPrivateSchedule; // 更新された予定をセット
            return { privateSchedules: updatedPrivateSchedules };
        });
    }

    editPrivateSchedule = (idx) => {
        // axios使ってjsonをsetStateする
        // 更新なのでID(modId)を含めて送信する必要がある。
        const updatedPsSchedule = this.state.privateSchedules[idx];

        // axiosを使って更新リクエストを送信
        axios.post('/privateSchedules/mod/', updatedPsSchedule)
        .then (json => {
            console.log(json);
            this.componentDidMount();
        });

    }

    handleCheckboxChange = (event, content) => {
        // チェックボックスの状態を更新する処理
        const updatedHwSchedule = content;
        updatedHwSchedule.completed = event.target.checked; // チェック状態を更新
        
        axios.post('/homeworkSchedules/mod/', updatedHwSchedule)
        .then (json => {
            console.log(json);
            this.componentDidMount();
        });
    }

    openModal = (contents, date) => {
        this.setState({
            showModal: true,
            selectedHwContents: contents,
            selectedHwDate: date,
        });
    };

    closeModal = () => {
        this.setState({ showModal: false });
    };

    onDragStart = (colIndex, date, contentIndex) => {
        this.setState({ dragData: { colIndex, date, contentIndex } });
    };

    onDragOver = (e) => {
        e.preventDefault(); // ドロップを許可する
    };

    onDrop = (colIndex, date) => {
        const { dragData, hwSchedules } = this.state;
        if (!dragData) return;

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



    render() {
        const { 
            vacations, 
            vacationStart, 
            vacationEnd, 
            privateSchedules, 
            columns, 
            hwSchedules, 
            showModal, 
            selectedHwDate, 
            selectedHwContents,
            today
        } = this.state;
        const dateRange = this.makeDateRange(vacationStart, vacationEnd);
        return (
            <div>
                <ul id='header'>
                    <li><h3>豆知識</h3></li>
                    <li><h1>Schedule Page</h1></li>
                    <li>
                        <TaskHeader 
                            taskList={hwSchedules.filter(content => content.contentDate === today)}
                            checkBoxChange={this.handleCheckboxChange}                     
                        />
                    </li>
                </ul>
                <Menu></Menu>

                {/* 休暇の選択 および 新しい予定の作成ボタン */}
                <div>
                    <select onChange={this.handleVacationChange}>
                        {vacations.map((vacation, index) => (
                            <option value={vacation.name} key={index}>
                                {vacation.name + ' (' + vacation.start + ' - ' + vacation.end + ')'}
                            </option>
                        ))}
                    </select>
                    <button onClick={()=>{window.location.href = '/scheduleMake'}}>新しい予定を作成</button>
                </div>

                {/* 私用・宿題の予定表 */}
                <table>
                    <thead>
                        <tr>
                            <th>日付</th>
                            <th>曜日</th>
                            <th>予定</th>
                            {columns.map((col, index) => ( 
                                <th key={index}>{col.columnTitle}</th> // 宿題のカラム
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {dateRange.map((date, index) => (
                            <tr key={index}> 
                                <td>{date.date}</td>
                                <td>{date.dayOfWeek}</td>

                                <td> {/* 私用の予定 */}
                                    {/* <input type="text" key={index}/> */}
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

                                {columns.map((col, colIdx) => ( // 宿題の予定
                                    <td key={colIdx} 
                                        onDragOver={this.onDragOver} 
                                        onDrop={() => this.onDrop(colIdx, date.date)}
                                    >
                                    
                                        {
                                            hwSchedules.filter(content => ((content.contentDate === date.date)&&(content.columnInfoId === col.id))).length > 1 ? (
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
                                                            draggable
                                                            onDragStart={() => this.onDragStart(colIdx, content.contentDate, contentIndex)}
                                                            style={{cursor: 'grab'}}
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

                                
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                color: 'black',
                                padding: '20px',
                                borderRadius: '5px',
                                minWidth: '300px',
                                maxWidth: '90%',
                            }}
                        >
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
 
            </div>
        );
    }
}
