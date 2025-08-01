import axios from 'axios';
import React from 'react';
import './TaskHeader.css';

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
        alert(`この順番でとりくんでみよう！: ${result}`);        
    }

    render() {
        const { taskList } = this.props;
        
        return (
        <div className="task-header">
            
            {(!taskList || taskList.length === 0) ? 
                <div><h3>今日やること</h3>なし</div> 
                :
                <div>
                <h3>今日やること</h3>
                <div className="task-header-list">
                <ol>
                    {taskList.sort((a, b) => a.contentOrder - b.contentOrder).map((content, index) => (
                        <li key={index}>
                            {/* <input 
                                type="checkbox" 
                                checked={content.completed} 
                                onChange={(e) => this.props.checkBoxChange(e, content)} 
                            /> */}
                            {content.content}
                        </li>
                    ))}
                </ol>
                </div>
                <button className="decision" onClick={()=>{this.rouletButtonClick(taskList)}}>ルーレット</button>
                </div>
            }
            
        </div>
        );
    }
}