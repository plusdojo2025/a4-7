import React, { Component } from 'react';

class ScheduleExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
        columns: [
            { id: 1, columnTitle: '自由研究' },
            { id: 2, columnTitle: '読書感想文' },
            { id: 3, columnTitle: '算数ドリル' }
        ],
        dateRange: [
            { date: '2025-07-27', dayOfWeek: '日' },
            { date: '2025-07-28', dayOfWeek: '月' },
            { date: '2025-07-29', dayOfWeek: '火' },
            { date: '2025-07-30', dayOfWeek: '水' },
            { date: '2025-07-31', dayOfWeek: '木' },
            { date: '2025-08-01', dayOfWeek: '金' },
            { date: '2025-08-02', dayOfWeek: '土' },
            { date: '2025-08-03', dayOfWeek: '日' },
            { date: '2025-08-04', dayOfWeek: '月' },
            { date: '2025-08-05', dayOfWeek: '火' },
            { date: '2025-08-06', dayOfWeek: '水' },
            { date: '2025-08-07', dayOfWeek: '木' },
            { date: '2025-08-08', dayOfWeek: '金' },
            { date: '2025-08-09', dayOfWeek: '土' },
            { date: '2025-08-10', dayOfWeek: '日' }
        ],
        privateSchedules: [
            { contentDate: '2025-07-27T00:00:00', content: '家族でBBQ' },
            { contentDate: '2025-07-30T00:00:00', content: '図書館へ行く' },
            { contentDate: '2025-08-03T00:00:00', content: '友達と遊ぶ' },
            { contentDate: '2025-08-08T00:00:00', content: 'おばあちゃん家へ' }
        ],
        hwSchedules: [
            { contentDate: '2025-07-27', columnInfoId: 3, content: 'ドリルp1-3', completed: false },
            { contentDate: '2025-07-28', columnInfoId: 2, content: '本を読む', completed: false },
            { contentDate: '2025-07-29', columnInfoId: 1, content: 'テーマ決め', completed: true },
            { contentDate: '2025-07-30', columnInfoId: 3, content: 'ドリルp4-6', completed: false },
            { contentDate: '2025-07-31', columnInfoId: 2, content: '感想メモ', completed: true },
            { contentDate: '2025-08-01', columnInfoId: 1, content: '調べ物', completed: false },
            { contentDate: '2025-08-02', columnInfoId: 3, content: 'ドリルp7-9', completed: true },
            { contentDate: '2025-08-03', columnInfoId: 1, content: 'まとめノート作成', completed: false },
            { contentDate: '2025-08-04', columnInfoId: 2, content: '下書き作成', completed: false },
            { contentDate: '2025-08-05', columnInfoId: 3, content: 'ドリルp10-12', completed: false },
            { contentDate: '2025-08-06', columnInfoId: 1, content: '写真を貼る', completed: true },
            { contentDate: '2025-08-07', columnInfoId: 2, content: '清書', completed: false },
            { contentDate: '2025-08-08', columnInfoId: 3, content: 'ドリルp13-15', completed: false },
            { contentDate: '2025-08-09', columnInfoId: 1, content: '仕上げ', completed: false },
            { contentDate: '2025-08-10', columnInfoId: 2, content: '提出準備', completed: false }
        ],
        vacations: [
            { decisionDate: '2025-08-05' }
        ],
        selectedVacationIdx: 0
    };
  }

  psInput = (e, idx) => {
    const updated = [...this.state.privateSchedules];
    updated[idx].content = e.target.value;
    this.setState({ privateSchedules: updated });
  };

  editPrivateSchedule = (idx) => {
    console.log("DB更新: ", this.state.privateSchedules[idx]);
  };

  onDragStart = (colIdx, date, contentIndex) => {
    console.log("DragStart", colIdx, date, contentIndex);
  };

  onDragOver = (e, colIdx) => {
    e.preventDefault();
  };

  onDragEnter = (e, colIdx) => {
    e.preventDefault();
  };

  onDragLeave = (e) => {};

  onDrop = (colIdx, date) => {
    console.log("Dropped on column:", colIdx, "for date:", date);
  };

  handleCheckboxChange = (e, content) => {
    const updated = this.state.hwSchedules.map(item =>
      item === content ? { ...item, completed: e.target.checked } : item
    );
    this.setState({ hwSchedules: updated });
  };

  dicisionBotton = (date) => {
    console.log("Vacation decision changed for date:", date);
  };

  render() {
    const {
      columns,
      dateRange,
      privateSchedules,
      hwSchedules,
      vacations,
      selectedVacationIdx
    } = this.state;

    return (
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
            </tr>
          </thead>
          <tbody>
            {dateRange.map((date, index) => (
              <tr key={index}>
                <td>{date.date}</td>
                <td>{date.dayOfWeek}</td>
                <td>
                  {privateSchedules.map((event, idx) =>
                    event.contentDate.split('T')[0] === date.date ? (
                      <input
                        key={idx}
                        type="text"
                        value={event.content}
                        onChange={(e) => this.psInput(e, idx)}
                        onBlur={() => this.editPrivateSchedule(idx)}
                      />
                    ) : null
                  )}
                </td>

                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className="drop-zone"
                    onDragOver={(e) => this.onDragOver(e, colIdx)}
                    onDragEnter={(e) => this.onDragEnter(e, colIdx)}
                    onDragLeave={this.onDragLeave}
                    onDrop={() => this.onDrop(colIdx, date.date)}
                  >
                    {hwSchedules.map((content, contentIndex) =>
                      content.contentDate === date.date &&
                      content.columnInfoId === col.id ? (
                        <div
                          key={contentIndex}
                          className="draggable"
                          draggable
                          onDragStart={() =>
                            this.onDragStart(colIdx, content.contentDate, contentIndex)
                          }
                        >
                          <input
                            type="checkbox"
                            checked={content.completed}
                            onChange={(e) => this.handleCheckboxChange(e, content)}
                          />
                          {content.content}
                        </div>
                      ) : null
                    )}
                  </td>
                ))}

                {vacations[selectedVacationIdx].decisionDate === date.date ? (
                  <td>
                    <button onClick={() => this.dicisionBotton(date.date)}>次の日へ</button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}

export default ScheduleExample;
