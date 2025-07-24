import axios from 'axios';
import React from 'react';
import './TriviaHeader.css';

export default class TriviaHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            today: "2025-07-30",
            trivia: ""
        };
    }

    componentDidMount = () => {
        // 今日の日付から trivia を取得
        const today = this.state.today;
        axios.get(`/api/trivias/${today}`)
            .then(json => {
                this.setState({ trivia: json.data });
            })
            .catch(error => {
                console.error("豆知識取得失敗...:", error);
            });
    }

    render(){
        const { trivia } = this.state;
        return (
            <div className="trivia-header">
                <h3>今日の豆知識 </h3>
                
                    <p>{trivia ? trivia.content : "豆知識はまだありません。"}</p>
              
            </div>
        );


    }
}