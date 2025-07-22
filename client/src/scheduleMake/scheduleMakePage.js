import React from "react";
import Menu from '../components/MenuHeader';

export default class ScheduleMakePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // ユーザーIDを追加
            usersId: this.props.usersId || 1, // propsから取得、なければデフォルト値
            // 休暇期間の設定
            vacationStart: '2025-07-20',
            vacationEnd: '2025-08-31',
            selectedVacation: '夏休み',
            // 休暇の種類
            vacations: [
                { name: '夏休み', start: '2025-07-20', end: '2025-08-31' },
                { name: '冬休み', start: '2025-12-20', end: '2026-01-10' },
                { name: '春休み', start: '2026-03-20', end: '2026-04-05' }
            ],
            // 課題以外の予定
            privateSchedules: [],
            // 固定の課題リスト
            fixedHwSchedulesList: [
                {
                    name: "夏休みの宿題",
                    contents: []
                },
                {
                    name: "読書感想文", 
                    contents: []
                },
                {
                    name: "自由研究",
                    contents: []
                },
            ],
            // 追加、削除可能な課題リスト
            additionalHwSchedulesList: [
                {
                    name: "計算ドリル",
                    contents: []
                }
            ]
        };
    }

 // データ保存
handleSave = async () => {
    const saveData = {
        userId: this.state.usersId,
        vacationName: this.state.selectedVacation,
        startDate: this.state.vacationStart,
        endDate: this.state.vacationEnd,
    };
    
    try {
        const response = await fetch('/api/vacations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saveData)
        });
        
        if (!response.ok) {
            console.error('保存失敗:', response.status);
        }
    } catch (error) {
        console.error('保存エラー:', error);
    }
}

    //休暇の種類が変更されたときに日付を自動設定の処理
    handleVacationChange = (event) => {
        const selectedVacation = this.state.vacations.find(v => v.name === event.target.value);
        if (selectedVacation) {
            this.setState({
                selectedVacation: selectedVacation.name,
                vacationStart: selectedVacation.start,
                vacationEnd: selectedVacation.end
            });
        }
    }
    // 休暇の開始日、終了日を手動で設定の処理
    handleVacationDateChange = (field, value) => {
        this.setState({
            [field]: value
        });
    }

    // 指定された機関の日付配列を作成
    makeDateRange(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateRange = [];
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];
            const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
            dateRange.push({ date: formattedDate, dayOfWeek: dayOfWeek });
        }
        return dateRange;
    }
    //課題以外の予定
    handlePrivateScheduleChange = (date, value) => {
        const newSchedules = [...this.state.privateSchedules];
        const existingIndex = newSchedules.findIndex(s => s.date === date);
        
        
        if (existingIndex >= 0) {
            if (value === '') {
               
                // 既存の項目を更新
                newSchedules[existingIndex].event = value;
            }
        } else if (value !== '') {
            // 新しい項目を追加
            newSchedules.push({ date: date, event: value });
        }
        
        this.setState({ privateSchedules: newSchedules });
    }

    // 固定の課題の内容変更
    handleFixedHwContentChange = (hwIndex, date, value) => {
        const newFixedHwSchedulesList = [...this.state.fixedHwSchedulesList];
        const existingIndex = newFixedHwSchedulesList[hwIndex].contents.findIndex(c => c.date === date);
        
        if (existingIndex >= 0) {
            if (value === '') {
                // 既存の項目を更新
                newFixedHwSchedulesList[hwIndex].contents[existingIndex].content = value;
            }
        } else if (value !== '') {
            // 新しい項目を追加
            newFixedHwSchedulesList[hwIndex].contents.push({ 
                date: date, 
                content: value, 
                checked: false 
            });
        }
        
        this.setState({ fixedHwSchedulesList: newFixedHwSchedulesList });
    }

    // 追加課題の内容変更
    handleAdditionalHwContentChange = (hwIndex, date, value) => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        const existingIndex = newAdditionalHwSchedulesList[hwIndex].contents.findIndex(c => c.date === date);
        
        if (existingIndex >= 0) {
            if (value === '') {
                // 既存の項目を更新
                newAdditionalHwSchedulesList[hwIndex].contents[existingIndex].content = value;
            }
        } else if (value !== '') {
            // 新しい項目を追加
            newAdditionalHwSchedulesList[hwIndex].contents.push({ 
                date: date, 
                content: value, 
                checked: false 
            });
        }
        
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList });
    }

    //新しい課題の列を追加
    add_column = () => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        newAdditionalHwSchedulesList.push({
            name: "",
            contents: []
        });
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList});
        return newAdditionalHwSchedulesList.length; 
    } 

    // 追加した課題の名前変更
    handleAdditionalHwNameChange = (hwIndex, newName) => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        newAdditionalHwSchedulesList[hwIndex].name = newName;
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList});
    }
    
    //列削除
    delete_column = (hwIndex) => {
        const newAdditionalHwSchedulesList = [...this.state.additionalHwSchedulesList];
        newAdditionalHwSchedulesList.splice(hwIndex,1);
        this.setState({ additionalHwSchedulesList: newAdditionalHwSchedulesList});
        return newAdditionalHwSchedulesList.length;
    }



    getPrivateScheduleForDate = (date) => {
        const schedule = this.state.privateSchedules.find(s => s.date === date);
        return schedule ? schedule.event : '';
    }

    getFixedHwContentForDate = (hwIndex, date) => {
        const content = this.state.fixedHwSchedulesList[hwIndex].contents.find(c => c.date === date);
        return content ? content.content : '';
    }

    getAdditionalHwContentForDate = (hwIndex, date) => {
        const content = this.state.additionalHwSchedulesList[hwIndex].contents.find(c => c.date === date);
        return content ? content.content : '';
    }

    render() {
        const { 
            vacations, 
            selectedVacation, 
            vacationStart, 
            vacationEnd, 
            fixedHwSchedulesList,
            additionalHwSchedulesList 
        } = this.state;
        
        //選択された期間の表
        const dateRange = this.makeDateRange(vacationStart, vacationEnd);

        return (
            <div>
                <h1>予定作成</h1>
                <Menu />
                <div>
                    {/* 休暇時期 */}
                    <div>
                        <select value={selectedVacation} onChange={this.handleVacationChange}>
                            {vacations.map((vacation, index) => (
                                <option value={vacation.name} key={index}>
                                    {vacation.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* 休暇期間 */}
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

                {/* 課題追加ボタン */}
                <div>
                    <div>
                        <button onClick={this.add_column}>＋</button>
                    </div>
                </div>

                {/* 予定表 */}
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>曜日</th>
                                <th>予定</th>
                                {/* 固定の課題列 */}
                                {fixedHwSchedulesList.map((hw, index) => (
                                    <th key={`fixed-${index}`}>
                                        {hw.name}
                                    </th>
                                ))}
                                {/* 追加、削除可能な課題列 */}
                                {additionalHwSchedulesList.map((hw, index) => (
                                    <th key={`additional-${index}`}>
                                        <input
                                            type="text"
                                            value={hw.name}
                                            onChange={(e) => this.handleAdditionalHwNameChange(index, e.target.value)}/>
                                            <br />
                                            {/* 削除ボタン */}
                                            <button onClick={() => this.delete_column(index)}>－</button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* 日付ごとの行 */}
                            {dateRange.map((date, index) => (
                                <tr key={index}>
                                    <td>{date.date}</td>
                                    <td>{date.dayOfWeek}</td>
                                    <td>
                                        {/* 課題以外の入力欄 */}
                                        <input 
                                            type="text" 
                                            placeholder="予定を入力"
                                            value={this.getPrivateScheduleForDate(date.date)}
                                            onChange={(e) => this.handlePrivateScheduleChange(date.date, e.target.value)}
                                        />
                                    </td>
                                    {/* 固定の課題入力 */}
                                    {fixedHwSchedulesList.map((hw, hwIndex) => (
                                        <td key={`fixed-${hwIndex}`}>
                                            <input 
                                                type="text" 
                                                placeholder="宿題内容を入力"
                                                value={this.getFixedHwContentForDate(hwIndex, date.date)}
                                                onChange={(e) => this.handleFixedHwContentChange(hwIndex, date.date, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    {/* 追加可能な課題入力 */}
                                    {additionalHwSchedulesList.map((hw, hwIndex) => (
                                        <td key={`additional-${hwIndex}`}>
                                            <input 
                                                type="text" 
                                                placeholder="宿題内容を入力"
                                                value={this.getAdditionalHwContentForDate(hwIndex, date.date)}
                                                onChange={(e) => this.handleAdditionalHwContentChange(hwIndex, date.date, e.target.value)}
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
            </div>
        );
    }
}