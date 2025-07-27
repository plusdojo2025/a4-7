import axios from 'axios';
import React from 'react';
import './TriviaHeader.css';
import Avatar from './Avatar';

export default class TriviaHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // today: "2025-07-30",
            today: props.today,
            trivia: "",
            setToday: props.setToday
        };
    }

    componentDidMount = () => {
        this.getTrivia(this.state.today);
    }

    componentDidUpdate(prevProps) {
        // props.today が変わったときに再フェッチ
        if (prevProps.today !== this.props.today) {
            this.getTrivia(this.props.today);
        }
    }

    getTrivia = (today) => {
        // 今日の日付から trivia を取得
        axios.get(`/api/trivias/${today}`)
            .then(json => {
                this.setState({ trivia: json.data });
            })
            .catch(error => {
                console.error("豆知識取得失敗...:", error);
            });
    }

    handleDateChange = (e) => {
        const selectedDate = e.target.value; // yyyy-mm-dd 形式
        this.state.setToday(selectedDate);
        this.setState({today: selectedDate});
    };

    render(){
        const { trivia, today} = this.state;
        return (
            <div className="trivia-header">
                <div className="trivia-content">
                    <Avatar />
                    <p className='balloon-008'>{trivia ? trivia.content : "豆知識はまだありません。"}</p>
                </div>
                <div>
                    <label>日付を選択してください：</label>
                    <input type="date" value={today} onChange={this.handleDateChange} />
                </div>      
            </div>
        );


    }
}