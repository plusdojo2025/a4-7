import React from "react";

export default class EventPage extends React.Component {
    // コンストラクタ
    constructor(props) {
        super(props);
        // state
        this.state = {
            events: [],                 // セレクトボックスに表示するイベント用配列
            selectedEventIndex: 0,         // 選択中のイベントid
            selectedEventTheme: "",     // 選択中のイベントテーマ
            content: "",                // 投稿内容
            like: false,                // いいねのステータス　デフォルトはいいねしてない状態
        }
    }

    // 投稿一覧取得
    componentDidMount() {
        fetch("/api/eventList/")
        .then(res => res.json())
        .then(json => {
            const selectedEvent = json[json.length - 1];    // 配列末尾のイベント情報取得　デフォルトで現在開催中のイベント
            this.setState({
                events: json,
                selectedEventIndex: json.length-1,
                selectedEventTheme: selectedEvent.theme
            })
        });
    }

    // 表示イベント変更
    changeEvent = (e) => {
        const {events} = this.state;
        const targetIndex = e.target.value;
        this.setState({
            selectedEventIndex: targetIndex,
            selectedEventTheme: events[targetIndex].theme
        });
        setTimeout(() => {
            // ほんの少し待ってから反映後の状態を見る
            console.log('→' + this.state.selectedEventIndex);
        }, 0);
    }

    // 入力時にstate更新
    onInput = (e) => {
        // 入力されたinputタグのname属性取得
        const key = e.target.name;
        this.setState({
            [key]: e.target.value   // name属性と同じ変数名のstate更新
        });
    }

    // 投稿内容登録
    addMyPost = () => {
        const {content} = this.state;
        console.log(content);
    }

    // いいね
    toggleLike = () => {
        const like = this.state.like;
        console.log(like);
        this.setState({
            like: !like
        });
        setTimeout(() => {
            // ほんの少し待ってから反映後の状態を見る
            console.log('→' + this.state.like);
        }, 0);
    }

    render() {
        const {events, selectedEventIndex, selectedEventTheme, content} = this.state;
        return (
            <div>
                {/* 表示イベント選択セレクトボックス */}
                <select value={selectedEventIndex} onChange={this.changeEvent}>
                    {events.map((event, index) =>
                        <option key={event.id} value={index}>{event.title}</option>
                    )}
                </select>

                {/* イベントテーマ */}
                <h2>お題：{selectedEventTheme}</h2>

                {/* 投稿 */}
                <div>
                    <input type="text" name="content" placeholder="投稿内容" onChange={this.onInput} value={content}/>
                    <button onClick={this.addMyPost}>投稿</button>
                </div>
                
                {/* 投稿一覧 */}
                <div>
                    <h3>他の人の投稿内容</h3>

                    <div>
                        <p>投稿内容</p>
                        <p>17</p>
                        <button onClick={this.toggleLike}>いいね！</button>
                    </div>
                </div>
            </div>
        );
    }
}