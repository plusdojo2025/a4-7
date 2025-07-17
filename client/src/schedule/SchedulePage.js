import React from 'react';

export default class SchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vacationStart: '2023-07-20',
            vacationEnd: '2023-08-31',
            vacations: [
                { name: '夏休み', start: '2023-07-20', end: '2023-08-31' },
                { name: '冬休み', start: '2023-12-20', end: '2024-01-10' },
                { name: '春休み', start: '2024-03-20', end: '2024-04-05' }
            ],
            privateSchedules: [
                { date: '2023-07-21', event: '海の日' },
                { date: '2023-08-01', event: '花火大会' },
                { date: '2023-08-15', event: 'お盆休み' }
            ],
            hwSchedulesList: [
                {name: "算数ドリル", contents: [
                    { "date": "2023-07-22", "content": "ページ1-10を解く", "checked": true },
                    { "date": "2023-07-22", "content": "ページ11-20を解く", "checked": false }, 
                    { "date": "2023-07-24", "content": "ページ21-30を解く", "checked": false }
                ]},
                {name: "理科ドリル", contents: [
                    { "date": "2023-07-24", "content": "植物の成長について調べる", "checked": false },
                    { "date": "2023-07-25", "content": "動物の生態について調べる", "checked": false }
                ]},
                {name: "国語ドリル", contents: [
                    { "date": "2023-07-24", "content": "漢字の練習", "checked": false },
                    { "date": "2023-07-25", "content": "読解問題を解く", "checked": false }
                ]}
            ], 
            showModal: false,
            selectedHwContents: [],
            selectedHwDate: '',
        };
    }

    componentDidMount() {
        // 初期化やデータの取得などの処理をここに記述
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

    editPrivateSchedule = (event) => {
        // axios使ってjsonをsetStateする
    }

    handleCheckboxChange = (hw, hwIndex, content, contentIndex) => {
        // チェックボックスの状態を更新する処理
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


    render() {
        const { vacations, vacationStart, vacationEnd, privateSchedules, hwSchedulesList } = this.state;
        const dateRange = this.makeDateRange(vacationStart, vacationEnd);
        let hwContentCnt = 0;
        return (
            <div>
                <h1>Schedule Page</h1>
                <nav>
                    <ul>
                        <li><a href="/">予定表</a></li>
                    </ul>
                </nav>

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
                            {hwSchedulesList.map((hw, index) => ( 
                                <th key={index}>{hw.name}</th> // 宿題のカラム
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dateRange.map((date, index) => (
                            <tr key={index}> 
                                <td>{date.date}</td>
                                <td>{date.dayOfWeek}</td>

                                <td> {/* 私用の予定 */}
                                    {privateSchedules.filter(event => event.date === date.date).map((event, idx) => (
                                        <input type="text" key={idx} value={event.event} onChange={this.editPrivateSchedule} />
                                    ))}
                                </td>

                                {hwSchedulesList.map((hw, hwIndex) => ( // 宿題の予定
                                    <td key={hwIndex}>
                                        {/*同じ曜日に2個以上の予定がある場合はまとめて数を表示し、数をクリックしたらモダールで詳細の予定が表示される*/}
                                        {hw.contents.filter(content => content.date === date.date).length > 1 ? (
                                            <span
                                                // style={{ color: 'blue', cursor: 'pointer' }}
                                                onClick={() =>
                                                    this.openModal(
                                                        hw.contents.filter(content => content.date === date.date),
                                                        date.date
                                                    )
                                                }
                                            >
                                                {hw.contents.filter(content => content.date === date.date).length} 件の予定
                                            </span>
                                        ) : (
                                            hw.contents
                                                .filter(content => content.date === date.date)
                                                .map((content, contentIndex) => (
                                                    <div key={contentIndex}>
                                                        <input
                                                            type="checkbox"
                                                            checked={content.checked}
                                                            onChange={() =>
                                                                this.handleCheckboxChange(hw, hwIndex, content, contentIndex)
                                                            }
                                                        />
                                                        {content.content}
                                                    </div>
                                                ))
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {this.state.showModal && (
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
                            <h3>{this.state.selectedHwDate} の宿題</h3>
                            <ul>
                                {this.state.selectedHwContents.map((content, idx) => (
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
