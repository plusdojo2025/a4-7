import axios from 'axios';
import React from 'react';

export default class TaskHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            taskList: props.taskList || []
        };
    }

    rouletButtonClick = (taskList) => {
        // taskのcontentOrder属性ををランダムに順番付けする
            // sort()メソッドは引数が負, 0, 正ののいずれか
            // Math.random()は0以上1未満のランダムな数値を返す
        const shuffledList = [...taskList].sort(() => Math.random() - 0.5);
        let contentOrder = 1;
        shuffledList.map((_, index) => {
            shuffledList[index].contentOrder = contentOrder;
            axios.post('/homeworkSchedules/mod/', shuffledList[index])
            .then(json => {console.log(`Content order updated: ${json.contentOrder}`);})
            contentOrder++;
        });    

        this.setState({ taskList: shuffledList });
        // ルーレットの結果を表示する
        const result = shuffledList.map(content => content.content).join(' ⇒ ');
        alert(`取り組む順番: ${result}`);        
    }

    render() {
        const { taskList } = this.props;
        return (
        <div className="task-header">
            <h3>今日のタスク一覧</h3>
            <ol>
                {taskList.sort((a, b) => a.contentOrder - b.contentOrder).map((content, index) => (
                    <li key={index}>
                        <input 
                            type="checkbox" 
                            checked={content.completed} 
                            onChange={(e) => this.props.checkBoxChange(e, content)} 
                        />
                        {content.content}
                    </li>
                ))}
            </ol>
            <button onClick={()=>{this.rouletButtonClick(taskList)}}>ルーレット</button>
            
        </div>
        );
    }
}