import React from "react";
import Menu from '../components/MenuHeader';

export default class ScheduleMakePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vacationStart: '2025-07-20',
            vacationEnd: '2025-08-31',
            selectedVacation: '夏休み',
            vacations: [
                { name: '夏休み', start: '2025-07-20', end: '2025-08-31' },
                { name: '冬休み', start: '2025-12-20', end: '2026-01-10' },
                { name: '春休み', start: '2026-03-20', end: '2026-04-05' }
            ],
            privateSchedules: [
                { date: '', event: '' }
            ],
            hwSchedulesList: [
                {
                    name: "算数ドリル",
                    contents: [
                        { date: '', content: '', checked: false }
                    ]
                },
                {
                    name: "理科ドリル", 
                    contents: [
                        { date: '', content: '', checked: false }
                    ]
                },
                {
                    name: "国語ドリル",
                    contents: [
                        { date: '', content: '', checked: false }
                    ]
                },
                {
                    name: "読書",
                    contents: [
                        { date: '', content: '', checked: false }
                    ]
                }
            ]
        };
    }

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

    handleVacationDateChange = (field, value) => {
        this.setState({
            [field]: value
        });
    }

    addPrivateSchedule = () => {
        this.setState({
            privateSchedules: [...this.state.privateSchedules, { date: '', event: '' }]
        });
    }

    removePrivateSchedule = (index) => {
        const newSchedules = this.state.privateSchedules.filter((_, i) => i !== index);
        this.setState({ privateSchedules: newSchedules });
    }

    handlePrivateScheduleChange = (index, field, value) => {
        const newSchedules = [...this.state.privateSchedules];
        newSchedules[index][field] = value;
        this.setState({ privateSchedules: newSchedules });
    }

    addHwContent = (hwIndex) => {
        const newHwSchedulesList = [...this.state.hwSchedulesList];
        newHwSchedulesList[hwIndex].contents.push({ date: '', content: '', checked: false });
        this.setState({ hwSchedulesList: newHwSchedulesList });
    }

    removeHwContent = (hwIndex, contentIndex) => {
        const newHwSchedulesList = [...this.state.hwSchedulesList];
        newHwSchedulesList[hwIndex].contents = newHwSchedulesList[hwIndex].contents.filter((_, i) => i !== contentIndex);
        this.setState({ hwSchedulesList: newHwSchedulesList });
    }

    handleHwContentChange = (hwIndex, contentIndex, field, value) => {
        const newHwSchedulesList = [...this.state.hwSchedulesList];
        newHwSchedulesList[hwIndex].contents[contentIndex][field] = value;
        this.setState({ hwSchedulesList: newHwSchedulesList });
    }

    saveSchedule = () => {
        console.log('予定を保存:', this.state);
        window.location.href = '/';
    }

    cancelSchedule = () => {
        window.location.href = '/';
    }

    render() {
        const { 
            vacations, 
            selectedVacation, 
            vacationStart, 
            vacationEnd, 
            privateSchedules, 
            hwSchedulesList 
        } = this.state;

        return (
            <div>
                <h1>新しい予定を作成</h1>
                <Menu />

                <div>
                    <h3>休暇期間の設定</h3>
                    <div>
                        <label>休暇の種類: </label>
                        <select value={selectedVacation} onChange={this.handleVacationChange}>
                            {vacations.map((vacation, index) => (
                                <option value={vacation.name} key={index}>
                                    {vacation.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>開始日: </label>
                        <input 
                            type="date" 
                            value={vacationStart}
                            onChange={(e) => this.handleVacationDateChange('vacationStart', e.target.value)}
                        />
                        <label>終了日: </label>
                        <input 
                            type="date" 
                            value={vacationEnd}
                            onChange={(e) => this.handleVacationDateChange('vacationEnd', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <h3>私用予定</h3>
                    {privateSchedules.map((schedule, index) => (
                        <div key={index}>
                            <input 
                                type="date" 
                                value={schedule.date}
                                onChange={(e) => this.handlePrivateScheduleChange(index, 'date', e.target.value)}
                            />
                            <input 
                                type="text" 
                                placeholder="イベント名"
                                value={schedule.event}
                                onChange={(e) => this.handlePrivateScheduleChange(index, 'event', e.target.value)}
                            />
                            <button onClick={() => this.removePrivateSchedule(index)}>削除</button>
                        </div>
                    ))}
                    <button onClick={this.addPrivateSchedule}>私用予定を追加</button>
                </div>

                <div>
                    <h3>宿題予定</h3>
                    {hwSchedulesList.map((hw, hwIndex) => (
                        <div key={hwIndex}>
                            <h4>{hw.name}</h4>
                            {hw.contents.map((content, contentIndex) => (
                                <div key={contentIndex}>
                                    <input 
                                        type="date" 
                                        value={content.date}
                                        onChange={(e) => this.handleHwContentChange(hwIndex, contentIndex, 'date', e.target.value)}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="宿題内容"
                                        value={content.content}
                                        onChange={(e) => this.handleHwContentChange(hwIndex, contentIndex, 'content', e.target.value)}
                                    />
                                    <button onClick={() => this.removeHwContent(hwIndex, contentIndex)}>削除</button>
                                </div>
                            ))}
                            <button onClick={() => this.addHwContent(hwIndex)}>
                                {hw.name}の項目を追加
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={this.saveSchedule}>保存</button>
                <button onClick={this.cancelSchedule}>キャンセル</button>
            </div>
        );
    }
}