import React from "react";
import axios from "axios";
import Menu from '../components/MenuHeader';
import '../schedule/SchedulePage.css'; 
import './ScheduleMakePage.css';
import BookRecommend from "./BookRecommend"

export default class ScheduleMakePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersId: this.props.usersId || 1,
            vacationStart: '2025-07-20',
            vacationEnd: '2025-08-31',
            selectedVacation: '夏休み',
            vacationId: 0,
            
            // 休暇の種類
            vacations: [
                { id: 1, name: '夏休み', start: '2025-07-20', end: '2025-08-31' },
                { id: 2, name: '冬休み', start: '2025-12-20', end: '2026-01-10' },
                { id: 3, name: '春休み', start: '2026-03-20', end: '2026-04-05' }
            ],
            
            // 休暇別の固定課題
            vacationFixedHw: {
                '夏休み': [
                    { 
                        name: "夏休みの宿題", 
                        contents: [
                        { date: '2025-07-22', content: 'ワーク 10～12', checked: false },
                        { date: '2025-07-24', content: 'ワーク 13～15', checked: false },
                        { date: '2025-08-04', content: 'ワーク 20～22', checked: false },
                        { date: '2025-08-06', content: 'ワーク 24～25', checked: false }

                        ], 
                        columnInfoId: 1,
                        helpText: "学校で配られたワークを進めよう！1日2〜3ページずつ取り組むのがおすすめ！"
                    },
                    { 
                        name: "読書感想文", 
                        contents: [
                        { date: '2025-07-23', content: '本探し', checked: false },
                        { date: '2025-07-24', content: '読書', checked: false },
                        { date: '2025-07-25', content: '読書', checked: false },
                        { date: '2025-08-08', content: '読書', checked: false },
                        { date: '2025-08-09', content: '下書き', checked: false },
                        { date: '2025-08-10', content: '下書き', checked: false },
                        { date: '2025-08-12', content: '清書', checked: false }                        
                        ], 
                        columnInfoId: 2,
                        helpText: "気に入った本を読んで感想をまとめよう！詳しくはここをクリックしてね！"
                    },
                    { 
                        name: "自由研究", 
                        contents: [
                        { date: '2025-07-24', content: 'テーマ探し', checked: false },
                        { date: '2025-07-25', content: 'テーマ探し', checked: false },
                        { date: '2025-08-08', content: '調査のかんそう', checked: false },
                        { date: '2025-08-10', content: '調査のかんそう', checked: false },
                        { date: '2025-08-12', content: '調査のかんそう', checked: false }
                        ], 
                        columnInfoId: 3,
                        helpText: "興味のあるテーマを選んで調べたり実験しよう！観察日記や実験記録をつけることが大切！"
                    }
                ],
                '冬休み': [
                    // { 
                    //     name: "冬休みの課題", 
                    //     contents: [
                    //         { date: '2025-12-27', content: 'ワーク 1～4', checked: false },
                    //         { date: '2025-12-30', content: 'ワーク 6～8', checked: false },
                    //         { date: '2026-01-04', content: 'ワーク 9～12', checked: false },
                    //     ], 
                    //     columnInfoId: 1,
                    //     helpText: "学校で配られたワークを進めよう！1日2〜3ページずつ取り組むのがおすすめ！"
                    // }
                ],
                '春休み': [
                    // { 
                    //     name: "春休みの課題", 
                    //     contents: [
                    //         { date: '2026-03-27', content: 'ワーク 1～4', checked: false },
                    //         { date: '2026-03-30', content: 'ワーク 5～8', checked: false },
                    //         { date: '2026-04-01', content: 'ワーク 9～12', checked: false },
                    //     ], 
                    //     columnInfoId: 1,
                    //     helpText: "学校で配られたワークを進めよう！1日2〜3ページずつ取り組むのがおすすめ！"
                    // }
                ]
            },
            
            // 課題以外の予定
            privateSchedules: [
                { date: '2025-07-22', event: 'じゅく' },
                { date: '2025-07-25', event: '海に行く' },
                { date: '2025-08-04', event: 'サッカーする' },
                { date: '2025-08-06', event: 'じゅく' }
            ],
            
            // 現在選択中の固定課題リスト
            fixedHwSchedulesList: [
                // { 
                //     name: "夏休みの宿題", 
                //     contents: [
                //         { date: '2025-07-22', content: 'ワーク 10～12', checked: false },
                //         { date: '2025-07-24', content: 'ワーク 13～15', checked: false },
                //         { date: '2025-08-04', content: 'ワーク 20～22', checked: false },
                //         { date: '2025-08-06', content: 'ワーク 24～25', checked: false }
                //     ], 
                //     columnInfoId: 1,
                //     helpText: "学校で配られたワークを進めよう！1日2〜3ページずつ取り組むのがおすすめ！"
                // },
                { 
                    name: "読書感想文", 
                    contents: [
                        { date: '2025-07-23', content: '本探し', checked: false },
                        { date: '2025-07-24', content: '読書', checked: false },
                        { date: '2025-07-25', content: '読書', checked: false },
                        { date: '2025-08-08', content: '読書', checked: false },
                        { date: '2025-08-09', content: '下書き', checked: false },
                        { date: '2025-08-10', content: '下書き', checked: false },
                        { date: '2025-08-12', content: '清書', checked: false }
                    ], 
                    columnInfoId: 2,
                    helpText: "気に入った本を読んで感想をまとめよう！詳しくはここをクリックしてね！",
                    specialBookFlag: true
                },
                { 
                    name: "自由研究", 
                    contents: [
                        { date: '2025-07-24', content: 'テーマ探し', checked: false },
                        { date: '2025-07-25', content: 'テーマ探し', checked: false },
                        { date: '2025-08-08', content: '調査のかんそう', checked: false },
                        { date: '2025-08-10', content: '調査のかんそう', checked: false },
                        { date: '2025-08-12', content: '調査のかんそう', checked: false }
                    ], 
                    columnInfoId: 3,
                    helpText: "興味のあるテーマを選んで調べたり実験しよう！観察日記や実験記録をつけることが大切！",
                    specialBookFlag: false
                }
            ],
            
            // 自由に追加できる課題
            additionalHwSchedulesList: [
                { 
                    name: "計算ドリル", 
                    contents: [
                            { date: '2025-07-22', content: 'ワーク 10～12', checked: false },
                            { date: '2025-07-24', content: 'ワーク 13～15', checked: false },
                            { date: '2025-08-04', content: 'ワーク 20～22', checked: false },
                            { date: '2025-08-06', content: 'ワーク 24～25', checked: false }
                    ], 
                    columnInfoId: 4, 
                    helpText: "学校で配られたワークを進めよう！1日2〜3ページずつ取り組むのがおすすめ！",
                    specialBookFlag: false
                 }
            ],
            
            nextColumnInfoId: 5,
            showHelpText: false,
            currentHelpText: "",
            currentHwContent: null,
            showModal: false
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    // 保存ボタンが押されたとき
    handleSave = async () => {
        // 休暇データを保存
        const saveData = {
            userId: this.state.usersId,
            vacationName: this.state.selectedVacation,
            startDate: this.state.vacationStart,
            endDate: this.state.vacationEnd,
        };
        
        try {
            // const response = await fetch('/api/vacations', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(saveData)
            // });

            axios.post('/api/vacations', saveData)
            .then(json=>{
                this.setState(
                    {vacationId: json.data.id}, ()=>{
                        this.savePrivateSchedules();
                        this.saveColumns();
                    }
                );
                return "hoge"
            })          
            .then(_=>{
                window.location.href = '/'
            })

        } catch (error) {
            console.error('休暇保存エラー:', error);
            return;
        }

        // // プライベート予定を保存
        // await this.savePrivateSchedules();
        
        // // 宿題予定を保存
        // await this.saveHomeworkSchedules();
    }

    // プライベート予定の保存
    savePrivateSchedules = async () => {
        for (const schedule of this.state.privateSchedules) {
            if (schedule.event && schedule.event.trim() !== '') {
                const privateScheduleData = {
                    userId: this.state.usersId,
                    content: schedule.event,
                    contentDate: schedule.date,
                    vacationId: this.state.vacationId
                };

                // 既存データがあるかチェック
                // const checkResponse = await fetch(`/privateSchedules/?userId=${this.state.usersId}&vacationId=${this.state.vacationId}`);
                
                // if (checkResponse.ok) {
                //     const existingSchedules = await checkResponse.json();
                //     const existingSchedule = existingSchedules.find(s => s.contentDate === schedule.date);
                    
                //     if (existingSchedule) {
                //         privateScheduleData.id = existingSchedule.id;
                //     }
                // }

                const response = await fetch('/privateSchedules/mod/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(privateScheduleData)
                });

                if (!response.ok) {
                    console.error('プライベート予定保存失敗:', response.status);
                }
            }
        }
    }

    saveColumns = () => {
        let columnsOrder = 0;

        // 固定課題
        this.state.fixedHwSchedulesList.map((hw, idx) => {
            const columnsData = {
                userId: this.state.usersId,
                columnTitle: hw.name,
                position: columnsOrder,
                vacationId: this.state.vacationId
            }

            columnsOrder++;

            axios.post(`/columns/save`, columnsData)
            .then(json=>{
                this.state.fixedHwSchedulesList[idx].columnInfoId = json.data.id
                return this.state.fixedHwSchedulesList[idx]
            })
            .then(hwUpdated => {
                this.saveEachHomework(hwUpdated);
            })
        })

        // 追加課題
        this.state.additionalHwSchedulesList.map((hw, idx) => {
            const columnsData = {
                userId: this.state.usersId,
                columnTitle: hw.name,
                position: columnsOrder,
                vacationId: this.state.vacationId
            }

            columnsOrder++;

            axios.post(`/columns/save`, columnsData)
            .then(json=>{
                this.state.additionalHwSchedulesList[idx].columnInfoId = json.data.id
                return this.state.additionalHwSchedulesList[idx]
            })
            .then(hwUpdated => {
                this.saveEachHomework(hwUpdated);
            })
        })
    }

    // 宿題予定の保存
    // saveHomeworkSchedules = async () => {
    //     // 固定課題を保存　　　
    //     for (const hw of this.state.fixedHwSchedulesList) {
    //         await this.saveEachHomework(hw);
    //     }
        
    //     // 追加課題を保存
    //     for (const hw of this.state.additionalHwSchedulesList) {
    //         await this.saveEachHomework(hw);
    //     }
        
    //     alert('予定が保存されました');
    // }

    // 各宿題の内容を保存
    saveEachHomework = async (homework) => {
        for (const content of homework.contents) {
            if (content.content && content.content.trim() !== '') {
                const homeworkScheduleData = {
                    userId: this.state.usersId,
                    columnInfoId: homework.columnInfoId,
                    content: content.content,
                    contentDate: content.date,
                    completed: false,
                    contentOrder: 0,
                    vacationId: this.state.vacationId
                };


                const response = await fetch('/homeworkSchedules/mod/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(homeworkScheduleData)
                });

                if (!response.ok) {
                    console.error('宿題予定保存失敗:', response.status);
                }


            }
        }
    }

    // 休暇が変更されたとき
    handleVacationChange = (event) => {
        const selectedVacation = this.state.vacations.find(v => v.name === event.target.value);
        if (selectedVacation) {
            // 選択された休暇に合わせて固定課題を変更
            const newFixedHwSchedulesList = this.state.vacationFixedHw[selectedVacation.name].map(hw => ({
                ...hw,
                contents: [...hw.contents] 
            }));

            this.setState({
                selectedVacation: selectedVacation.name,
                vacationStart: selectedVacation.start,
                vacationEnd: selectedVacation.end,
                vacationId: selectedVacation.id,
                fixedHwSchedulesList: newFixedHwSchedulesList
            });
        }
    }

    // 休暇の日付を変更
    handleVacationDateChange = (field, value) => {
        this.setState({ [field]: value });
    }

    // 指定された期間の表を作成
    makeDateRange(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateRange = [];
        
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];
            const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
            dateRange.push({ date: formattedDate, dayOfWeek });
        }
        return dateRange;
    }

    // プライベート予定を変更
    handlePrivateScheduleChange = (date, value) => {
        const newSchedules = [...this.state.privateSchedules];
        const existingIndex = newSchedules.findIndex(s => s.date === date);
        
        if (existingIndex >= 0) {
            newSchedules[existingIndex].event = value;
        } else if (value !== '') {
            newSchedules.push({ date, event: value });
        }
        
        this.setState({ privateSchedules: newSchedules });
    }

    // 固定課題の内容を変更
    handleFixedHwContentChange = (hwIndex, date, value) => {
        const newFixedHwSchedulesList = [...this.state.fixedHwSchedulesList];
        const existingIndex = newFixedHwSchedulesList[hwIndex].contents.findIndex(c => c.date === date);
        
        if (existingIndex >= 0) {
            newFixedHwSchedulesList[hwIndex].contents[existingIndex].content = value;
        } else if (value !== '') {
            newFixedHwSchedulesList[hwIndex].contents.push({ date, content: value, checked: false });
        }
        
        this.setState({ fixedHwSchedulesList: newFixedHwSchedulesList });
    }

    // 追加課題の内容を変更
    handleAdditionalHwContentChange = (hwIndex, date, value) => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        const existingIndex = newAdditionalHwSchedulesList[hwIndex].contents.findIndex(c => c.date === date);
        
        if (existingIndex >= 0) {
            newAdditionalHwSchedulesList[hwIndex].contents[existingIndex].content = value;
        } else if (value !== '') {
            newAdditionalHwSchedulesList[hwIndex].contents.push({ date, content: value, checked: false });
        }
        
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList });
    }

    // 新しい課題列を追加
    addColumn = () => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        newAdditionalHwSchedulesList.push({
            name: "",
            contents: [],
            columnInfoId: this.state.nextColumnInfoId,
            helpText: "学校で配られたワークを進めよう！1日2〜3ページずつ取り組むのがおすすめ！",
            specialBookFlag: false
        });
        
        this.setState({ 
            additionalHwSchedulesList: newAdditionalHwSchedulesList,
            nextColumnInfoId: this.state.nextColumnInfoId + 1 
        });
    } 

    // 追加課題の名前を変更
    handleAdditionalHwNameChange = (hwIndex, newName) => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        newAdditionalHwSchedulesList[hwIndex].name = newName;
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList });
    }
    
    // 列を削除
    deleteColumn = (hwIndex) => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        newAdditionalHwSchedulesList.splice(hwIndex, 1);
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList });
    }

    // // 課題補助を表示
    // showHelpText = (helpText) => {
    //     this.setState({ showHelpText: true, currentHelpText: helpText });
    // }

    // // 課題補助を消す
    // hideHelpText = () => {
    //     this.setState({ showHelpText: false, currentHelpText: "" });
    // }

    // 課題補助を表示
    showHelpText = (focusedHwContent) => {
        this.setState({ showHelpText: true, currentHwContent: focusedHwContent });
    }

    // 課題補助を消す
    hideHelpText = () => {
        this.setState({ showHelpText: false, currentHelpText: null });
    }

    // 画面をクリックしたとき
    handleDocumentClick = (event) => {
        const isFixedHwInput = event.target.type === 'text' && 
                              event.target.placeholder === '宿題内容を入力' &&
                              event.target.hasAttribute('data-fixed-hw');
        
        if (!isFixedHwInput) {
            this.hideHelpText();
        }
    }

    // 指定した日付のプライベート予定を取得
    getPrivateScheduleForDate = (date) => {
        const schedule = this.state.privateSchedules.find(s => s.date === date);
        return schedule ? schedule.event : '';
    }

    // 指定した日付の固定課題を取得
    getFixedHwContentForDate = (hwIndex, date) => {
        const content = this.state.fixedHwSchedulesList[hwIndex].contents.find(c => c.date === date);
        return content ? content.content : '';
    }

    // 指定した日付の追加課題を取得
    getAdditionalHwContentForDate = (hwIndex, date) => {
        const content = this.state.additionalHwSchedulesList[hwIndex].contents.find(c => c.date === date);
        return content ? content.content : '';
    }

    openModal = () => {
        this.setState({showModal: true});
    };

    closeModal = () => {
        this.setState({ showModal: false});
    };

    render() {
        const { 
            vacations, 
            selectedVacation, 
            vacationStart, 
            vacationEnd, 
            fixedHwSchedulesList,
            additionalHwSchedulesList,
            showHelpText,
            currentHelpText,
            currentHwContent
        } = this.state;
        
        const dateRange = this.makeDateRange(vacationStart, vacationEnd);

        return (
            <div>
                <h1>予定作成</h1>
                <Menu />
                
                

                <div>
                    {/* 休暇選択 */}
                    <div>
                        <select value={selectedVacation} onChange={this.handleVacationChange}>
                            {vacations.map((vacation, index) => (
                                <option value={vacation.name} key={index}>
                                    {vacation.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* 日付設定 */}
                    <div>
                        <label>開始日</label>
                        <input 
                            type="date" 
                            value={vacationStart}
                            onChange={(e) => this.handleVacationDateChange('vacationStart', e.target.value)}
                        />
                        <label>終了日</label>
                        <input 
                            type="date" 
                            value={vacationEnd}
                            onChange={(e) => this.handleVacationDateChange('vacationEnd', e.target.value)}
                        />
                    </div>
                </div>

                {/* 課題補助 */}
                {showHelpText && (
                    <div className="hint">
                        <strong>宿題ヒント：</strong>
                        {/* {currentHelpText} */}
                        {
                            currentHwContent.specialBookFlag? (
                                <span  onClick={this.openModal}>{currentHwContent.helpText}</span>

                            ):<span>{currentHwContent.helpText}</span>
                        }

                    </div>
                )}

                {/* 予定表 */}
                <div>
                    <table id="scheduleTable">
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>曜日</th>
                                <th>予定</th>
                                
                                {/* 固定課題の列 */}
                                {fixedHwSchedulesList.map((hw, index) => (
                                    <th key={`fixed-${index}`}>{hw.name}</th>
                                ))}
                                
                                {/* 追加課題の列 */}
                                {additionalHwSchedulesList.map((hw, index) => (
                                    <th key={`additional-${index}`}>
                                        <button onClick={() => this.deleteColumn(index)}>－</button>
                                        <br />
                                        <input
                                            type="text"
                                            value={hw.name}
                                            onChange={(e) => this.handleAdditionalHwNameChange(index, e.target.value)}
                                            className="addHwInput"
                                        />
                                        
                                        
                                    </th>
                                ))}
                                <th>
                                    {/* 課題追加ボタン */}
                                    <div>
                                        <button onClick={this.addColumn}>＋</button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dateRange.map((date, index) => (
                                <tr key={index}>
                                    <td>{date.date}</td>
                                    <td>{date.dayOfWeek}</td>
                                    <td>
                                        <input 
                                            type="text" 
                                            placeholder="予定を入力"
                                            value={this.getPrivateScheduleForDate(date.date)}
                                            onChange={(e) => this.handlePrivateScheduleChange(date.date, e.target.value)}
                                        />
                                    </td>
                                    
                                    {/* 固定課題の入力欄 */}
                                    {fixedHwSchedulesList.map((hw, hwIndex) => (
                                        <td key={`fixed-${hwIndex}`}>
                                            <input 
                                                type="text" 
                                                placeholder="宿題内容を入力"
                                                data-fixed-hw="true"
                                                value={this.getFixedHwContentForDate(hwIndex, date.date)}
                                                onChange={(e) => this.handleFixedHwContentChange(hwIndex, date.date, e.target.value)}
                                                // onMouseEnter={() => this.showHelpText(hw.helpText)}
                                                // onFocus={() => this.showHelpText(hw.helpText)}
                                                onMouseEnter={() => this.showHelpText(hw)}
                                                onFocus={() => this.showHelpText(hw)}
                                            />
                                        </td>
                                    ))}
                                    
                                    {/* 追加課題の入力欄 */}
                                    {additionalHwSchedulesList.map((hw, hwIndex) => (
                                        <td key={`additional-${hwIndex}`}>
                                            <input 
                                                type="text" 
                                                placeholder="宿題内容を入力"
                                                value={this.getAdditionalHwContentForDate(hwIndex, date.date)}
                                                onChange={(e) => this.handleAdditionalHwContentChange(hwIndex, date.date, e.target.value)}
                                                // onMouseEnter={() => this.showHelpText(hw.helpText)}
                                                // onFocus={() => this.showHelpText(hw.helpText)}
                                                onMouseEnter={() => this.showHelpText(hw)}
                                                onFocus={() => this.showHelpText(hw)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <button onClick={this.handleSave}>決定</button>
                </div>

                <button onClick={this.openModal}>推薦図書</button>

                {this.state.showModal && (
                    <div id='modal'>
                        <div id='modalContent'>
                            <BookRecommend />
                            <button onClick={this.closeModal}>閉じる</button>
                        </div>
                    </div>
                )}  
            </div>
        );
    }
}